import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { flightSearchFunction, executeFlightSearch } from '@/lib/openai-functions';
import { transformFlightResultsToCards } from '@/lib/flight-transformer';
import { validateFlightSearchParams, handleFlightSearchError } from '@/lib/validation';
import { checkRateLimit, chatRateLimiter } from '@/lib/rate-limiter';
import { tripService } from '@/lib/trip-service';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types for our chat system
interface ChatMessage {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface TripDetails {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
}

interface Card {
  type: 'flight' | 'hotel' | 'restaurant' | 'activity' | 'transport' | 'place';
  title: string;
  description: string;
  price?: string;
  rating?: number;
  location?: string;
  image?: string;
  bookingUrl?: string;
}

interface AIResponse {
  message: string;
  suggestions?: Array<{
    type: 'flight' | 'hotel' | 'restaurant' | 'activity' | 'place';
    title: string;
    description: string;
    price?: string;
    location?: string;
  }>;
  "follow-up message": string;
  "trip-context": TripDetails;
}

// Function to get current date in a readable format
function getCurrentDateString(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return now.toLocaleDateString('en-US', options);
}

// Function to sanitize JSON response from AI
function sanitizeJSONResponse(text: string): string {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
}



// System prompt for the AI travel assistant
const SYSTEM_PROMPT = `You are an AI travel assistant that helps users plan their trips.

CRITICAL: You MUST respond using ONLY a valid JSON object. Do NOT include any text outside the JSON. Do NOT include backticks or markdown.

RESPONSE FORMAT:
{
  "message": "Your conversational response to the user",
  "suggestions": [
    {
      "type": "flight|hotel|restaurant|activity|place",
      "title": "Name",
      "description": "Brief description",
      "price": "Price range",
      "location": "Location"
    }
  ],
  "follow-up message": "Your follow-up question or next step",
  "trip-context": {
    "from": "origin location or empty string",
    "to": "destination or empty string", 
    "departDate": "YYYY-MM-DD or empty string",
    "returnDate": "YYYY-MM-DD or empty string",
    "passengers": 0
  }
}

TRIP CONTEXT:
- Extract destination from user messages → update "to" field
- Extract origin from user messages → update "from" field  
- Extract dates from user messages → update "departDate" and "returnDate"
- Extract number of travelers → update "passengers"
- Preserve existing trip context from system prompt
- Only update fields when user provides new information

SUGGESTIONS:
- Include suggestions array when user asks about flights, hotels, restaurants, activities, or places
- Leave suggestions empty array [] if no specific recommendations needed

FLIGHT SEARCH:
- Use search_flights function when users ask about flights
- Always use current trip context for searches
- Detect user preferences for flight search type:
  * "cheapest" - when user asks for cheapest, lowest price, budget options
  * "fastest" - when user asks for fastest, quickest, shortest duration
  * "best" - when user asks for best, premium, or doesn't specify (default)
- Limit results to 2 flights per search to avoid overwhelming the user

Be helpful, conversational, and always consider the current trip context when making recommendations.`;





// Function to create a context summary for long conversations
function createContextSummary(conversationHistory: ChatMessage[]): string {
  const summary = [];
  
  // Always include current date
  const currentDate = getCurrentDateString();
  summary.push(`Current date: ${currentDate}`);
  
  // Extract key decisions and preferences from recent messages
  const recentMessages = conversationHistory.slice(-10);
  const decisions = [];
  
  for (const msg of recentMessages) {
    if (msg.type === 'user') {
      const content = msg.content.toLowerCase();
      if (content.includes('hotel') || content.includes('accommodation')) {
        decisions.push('User asked about hotels/accommodation');
      }
      if (content.includes('flight') || content.includes('airline')) {
        decisions.push('User asked about flights');
      }
      if (content.includes('restaurant') || content.includes('food')) {
        decisions.push('User asked about restaurants/food');
      }
      if (content.includes('activity') || content.includes('attraction')) {
        decisions.push('User asked about activities/attractions');
      }
    }
  }
  
  if (decisions.length > 0) {
    summary.push(`Recent topics: ${[...new Set(decisions)].join(', ')}`);
  }
  
  return summary.length > 0 ? `Context: ${summary.join('. ')}` : '';
}

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client for server-side auth
    const supabase = createSupabaseServerClient(request);

    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    console.log('API - Auth cookies:', request.cookies.getAll().filter(c => c.name.includes('auth')).map(c => c.name));
    console.log('API - Session exists:', !!session);
    console.log('API - Session user:', session?.user?.email);
    console.log('API - Auth error:', authError);
    
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(request, chatRateLimiter);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, conversationHistory = [], tripId } = body;

    console.log('API - Received message:', message);
    console.log('API - Received conversation history length:', conversationHistory.length);

    // Validate conversation history is an array
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: 'Conversation history must be an array' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Create trip on first message
    let currentTripId = tripId;
    if (!currentTripId && conversationHistory.length === 0) {
      currentTripId = await tripService.createTrip(session.user.id);
      if (!currentTripId) {
        return NextResponse.json(
          { error: 'Failed to create trip' },
          { status: 500 }
        );
      }
    }



    // Prepare conversation history for OpenAI with length limits
    const MAX_CONVERSATION_MESSAGES = 20; // Limit to last 20 messages to manage token usage
    const MAX_MESSAGES_FOR_SUMMARY = 30; // If more than this, use summary instead
    
    const filteredHistory = conversationHistory
      .filter((msg: ChatMessage) => msg.content && msg.content.trim() !== '');
    
    let messages: any[];
    
    if (filteredHistory.length > MAX_MESSAGES_FOR_SUMMARY) {
      // For very long conversations, use summary + recent messages
      const contextSummary = createContextSummary(filteredHistory);
      const recentMessages = filteredHistory.slice(-10); // Keep last 10 messages
      
      messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT + '\n\n' + contextSummary },
        ...recentMessages.map((msg: ChatMessage) => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content.trim()
        })),
        { role: 'user' as const, content: message }
      ];
    } else {
      // For shorter conversations, use full history (up to limit)
      const limitedHistory = filteredHistory.slice(-MAX_CONVERSATION_MESSAGES);
      
      messages = [
        { role: 'system' as const, content: SYSTEM_PROMPT },
        ...limitedHistory.map((msg: ChatMessage) => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content.trim()
        })),
        { role: 'user' as const, content: message }
      ];
    }

    // Always include current date in the system prompt
    const currentDate = getCurrentDateString();
    const baseContext = `\n\nCURRENT DATE: ${currentDate}\n\nHelp the user establish their travel plans by asking about destinations, dates, and number of travelers. Always extract and maintain trip context from the conversation.`;
    
    messages[0].content += baseContext;





    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      tools: [flightSearchFunction],
      tool_choice: "auto",
      response_format: { type: "json_object" }
    });

    let aiResponseText = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
    let flightCards: any[] = [];

    // Handle tool calls
    const responseMessage = completion.choices[0]?.message;
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      console.log('API - Processing tool calls:', responseMessage.tool_calls.length);
      
      // Add the assistant message with tool calls to the conversation
      messages.push({
        role: 'assistant' as const,
        content: responseMessage.content || '',
        tool_calls: responseMessage.tool_calls
      });
      
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === 'search_flights') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('API - Flight search args:', args);
            
            // Validate flight search parameters
            const validationErrors = validateFlightSearchParams(args);
            if (validationErrors.length > 0) {
              const errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
              console.error('Flight search validation errors:', validationErrors);
              messages.push({
                role: 'tool' as const,
                content: JSON.stringify({
                  success: false,
                  error: errorMessage
                }),
                tool_call_id: toolCall.id
              });
              continue;
            }
            
            const flightResults = await executeFlightSearch(args);
            console.log('API - Flight search results:', flightResults.success ? 'Success' : 'Failed');
            
            // Transform flight results to cards
            if (flightResults.success) {
              flightCards = transformFlightResultsToCards(flightResults);
            }
            
            // Add flight results to the conversation
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify(flightResults),
              tool_call_id: toolCall.id
            });
          } catch (error) {
            console.error('Error executing flight search:', error);
            const userFriendlyError = handleFlightSearchError(error);
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify({
                success: false,
                error: userFriendlyError
              }),
              tool_call_id: toolCall.id
            });
          }
        }
      }
      
      // Get final response from OpenAI after tool execution
      try {
        const finalCompletion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages,
          temperature: 0.7,
          max_tokens: 1500,
          response_format: { type: "json_object" }
        });
        
        aiResponseText = finalCompletion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
      } catch (finalError) {
        console.error('Error getting final completion after tool calls:', finalError);
        // If the final completion fails, try one more time with explicit JSON format
        try {
          const fallbackCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              { role: 'system', content: 'You MUST respond using ONLY a valid JSON object. Do NOT include any text outside the JSON. Use the flight search results provided to create a helpful response.' },
              { role: 'user', content: message },
              ...messages.slice(-2) // Include the last assistant and tool messages
            ],
            temperature: 0.7,
            max_tokens: 1500,
            response_format: { type: "json_object" }
          });
          aiResponseText = fallbackCompletion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
        } catch (fallbackError) {
          console.error('Fallback completion also failed:', fallbackError);
          // Use the original response if available, otherwise create a simple response
          aiResponseText = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
        }
      }
    }

    // Parse the JSON response from AI
    let aiResponse: AIResponse;
    try {
      console.log('Raw AI response:', JSON.stringify(aiResponseText));
      const sanitizedResponse = sanitizeJSONResponse(aiResponseText);
      aiResponse = JSON.parse(sanitizedResponse);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw AI response:', JSON.stringify(aiResponseText));
      
      // Create a fallback response if JSON parsing fails
      aiResponse = {
        message: "I found some flight options for you! Here are the details:",
        suggestions: [],
        "follow-up message": "Would you like me to search for more options or help you with anything else?",
        "trip-context": {
          from: "",
          to: "",
          departDate: "",
          returnDate: "",
          passengers: 0
        }
      };
    }

    // Update trip if AI provided new details
    if (currentTripId && aiResponse["trip-context"]) {
      await tripService.updateTrip(currentTripId, {
        origin: aiResponse["trip-context"].from,
        destination: aiResponse["trip-context"].to,
        departure_date: aiResponse["trip-context"].departDate,
        return_date: aiResponse["trip-context"].returnDate,
        passenger_count: aiResponse["trip-context"].passengers
      });
    }

    // Create the response object
    const response = {
      id: Date.now(),
      type: 'ai' as const,
      content: aiResponse.message,
      cards: flightCards.length > 0 ? flightCards : (aiResponse.suggestions || []),
      followUp: aiResponse["follow-up message"],
      tripContext: aiResponse["trip-context"],
      tripId: currentTripId,
      timestamp: new Date()
    };

    console.log('API - Final response tripContext:', response.tripContext);

    // Create response with rate limit headers
    const nextResponse = NextResponse.json(response);
    
    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Invalid value for \'content\'')) {
        return NextResponse.json(
          { error: 'Invalid message content detected. Please try again.' },
          { status: 400 }
        );
      }
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'OpenAI API configuration error' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 