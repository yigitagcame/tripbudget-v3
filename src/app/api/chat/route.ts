import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { 
  flightSearchFunction, 
  executeFlightSearch, 
  accommodationSearchFunction, 
  executeAccommodationSearch,
  cheapestDestinationFunction,
  executeCheapestDestinationSearch,
  packageDealFunction,
  executePackageDealSearch,
  seasonalPriceFunction,
  executeSeasonalPriceAnalysis
} from '@/lib/openai-functions';
import { transformFlightResultsToCards } from '@/lib/flight-transformer';
import { transformAccommodationResultsToCards } from '@/lib/accommodation-transformer';
import { 
  transformCheapestDestinationResults, 
  transformPackageDealResults, 
  transformSeasonalAnalysisResults 
} from '@/lib/creative-results-transformer';
import { validateFlightSearchParams, handleFlightSearchError, validateAccommodationSearchParams, handleAccommodationSearchError } from '@/lib/validation';
import { checkRateLimit, chatRateLimiter } from '@/lib/rate-limiter';
// NOTE: We use the server-side trip service here because the API route needs to bypass RLS for trip verification and updates.
// This service uses the Supabase service role key and MUST NEVER be imported in client-side code.
import { tripServiceServer } from '@/lib/server/trip-service-server';
import { MessageService } from '@/lib/message-service';
import { MessageCounterServiceServer } from '@/lib/server/message-counter-service-server';
import { posthog } from 'posthog-js';

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

// Card interface removed as it's not used

interface AIResponse {
  message: string;
  suggestions?: Array<{
    type: 'flight' | 'hotel' | 'restaurant' | 'activity' | 'place' | 'destination' | 'package' | 'seasonal';
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
      "type": "flight|hotel|restaurant|activity|place|destination",
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

CURRENCY: Always display prices in the user's preferred currency (EUR for Euro, USD for US Dollar). When making recommendations, consider the currency context and mention prices in the appropriate format.

TRIP CONTEXT:
- CRITICAL: If trip context is provided in the system prompt, you MUST preserve it and only update fields when the user explicitly provides new information
- Extract destination from user messages → update "to" field (only if not already set or user provides new destination)
- Extract origin from user messages → update "from" field (only if not already set or user provides new origin)
- Extract dates from user messages → update "departDate" and "returnDate" (only if not already set or user provides new dates)
- Extract number of travelers → update "passengers" (only if not already set or user provides new passenger count)
- NEVER overwrite existing trip context unless the user explicitly provides new information
- Always use the existing trip context as the foundation for your recommendations

SUGGESTIONS:
- Include suggestions array when user asks about flights, hotels, restaurants, activities, places, or destinations
- Use "destination" type for destination suggestions (cities, countries, regions)
- Leave suggestions empty array [] if no specific recommendations needed

FLIGHT SEARCH:
- Use search_flights function when users ask about flights
- Always use current trip context for searches
- Detect user preferences for flight search type:
  * "cheapest" - when user asks for cheapest, lowest price, budget options
  * "fastest" - when user asks for fastest, quickest, shortest duration
  * "best" - when user asks for best, premium, or doesn't specify (default)
- Limit results to 2 flights per search to avoid overwhelming the user

ACCOMMODATION SEARCH:
- Use search_accommodation function when users ask about hotels, accommodations, places to stay
- Always use current trip context for searches
- Detect user preferences for accommodation search type:
  * "budget" - when user asks for budget, cheap, affordable, low-cost options
  * "luxury" - when user asks for luxury, premium, high-end, 5-star options
  * "best" - when user asks for best, recommended, or doesn't specify (default)
- Limit results to 3 hotels per search to provide good options

CREATIVE SEARCH CAPABILITIES:

1. CHEAPEST DESTINATION SEARCH:
- Use find_cheapest_destination function when users ask:
  * "What's the cheapest place to go?"
  * "Where can I travel on a budget?"
  * "Show me the cheapest destinations"
  * "What's the most affordable place to visit?"
- This function compares multiple destinations for total cost (flight + accommodation)
- Always provide the origin location (fly_from) and travel dates
- The function will return top 3 cheapest destinations with cost breakdown

2. PACKAGE DEAL OPTIMIZATION:
- Use find_package_deal function when users ask:
  * "Find me a complete package to [destination]"
  * "Show me flight and hotel packages"
  * "What's the best deal for [destination]?"
  * "I want a complete trip package"
- This function finds the best flight + accommodation combinations
- Consider user's budget and preferences (price vs. quality vs. location)
- Return top 3 package options with total cost

3. SEASONAL PRICE ANALYSIS:
- Use analyze_seasonal_prices function when users ask:
  * "When is the best time to visit [destination]?"
  * "What's the cheapest time to go to [destination]?"
  * "When should I book for [destination]?"
  * "Show me price trends for [destination]"
- This function analyzes prices across different months
- Provide origin, destination, and date range to analyze
- Return monthly price trends and recommendations

INTENT DETECTION:
- "cheapest place to go" → find_cheapest_destination
- "best time to visit" → analyze_seasonal_prices  
- "complete package" → find_package_deal
- "budget travel" → combine cheapest flights + budget accommodation
- "luxury trip" → combine premium flights + luxury accommodation
- "quick getaway" → focus on shorter duration options
- "family vacation" → consider child-friendly destinations and accommodation

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

// Function to create trip context string from database data
function createTripContextString(tripData: { origin?: string; destination?: string; departure_date?: string; return_date?: string; passenger_count?: number }): string {
  if (!tripData) {
    return '';
  }

  const hasExistingContext = tripData.origin || tripData.destination || tripData.departure_date || tripData.return_date || tripData.passenger_count;
  
  if (!hasExistingContext) {
    return '';
  }

  return `\n\nCURRENT TRIP CONTEXT FROM DATABASE:
From: ${tripData.origin || 'Not specified'}
To: ${tripData.destination || 'Not specified'}
Departure Date: ${tripData.departure_date || 'Not specified'}
Return Date: ${tripData.return_date || 'Not specified'}
Passengers: ${tripData.passenger_count || 0}

CRITICAL: You MUST preserve and build upon these existing trip details. Only update fields when the user provides new information. Always consider these details when making recommendations.`;
}

export async function POST(request: NextRequest) {
  try {
    // Track chat API call
    posthog.capture('chat_api_called', {
      timestamp: new Date().toISOString(),
      user_agent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

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
    const { message, conversationHistory = [], tripId, currency = 'EUR' } = body;

    console.log('API - Received message:', message);
    console.log('API - Received conversation history length:', conversationHistory.length);
    console.log('API - Received tripId:', tripId);
    console.log('API - Received currency:', currency);

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

    // Validate tripId is provided
    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    // Verify trip exists and belongs to user
    console.log('API - Verifying trip exists and belongs to user');
    const trip = await tripServiceServer.getTrip(tripId);
    console.log('API - Trip found:', !!trip);
    console.log('API - Trip user_id:', trip?.user_id);
    console.log('API - Session user_id:', session.user.id);
    
    if (!trip || trip.user_id !== session.user.id) {
      console.log('API - Trip verification failed - trip not found or access denied');
      return NextResponse.json(
        { error: 'Trip not found or access denied' },
        { status: 404 }
      );
    }
    
    console.log('API - Trip verification successful');

    // Check if user has enough messages
    const hasEnoughMessages = await MessageCounterServiceServer.hasEnoughMessages(session.user.id);
    
    if (!hasEnoughMessages) {
      return NextResponse.json(
        { 
          error: 'Insufficient messages',
          message: 'You have run out of messages. Please earn more messages to continue chatting.',
          messageCount: 0
        },
        { status: 402 }
      );
    }

    const currentTripId = tripId;

    // Load existing trip context from database
    const existingTripContext = createTripContextString(trip);
    console.log('API - Existing trip context loaded:', existingTripContext ? 'Yes' : 'No');

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
        { role: 'system' as const, content: SYSTEM_PROMPT + '\n\n' + contextSummary + existingTripContext },
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
        { role: 'system' as const, content: SYSTEM_PROMPT + existingTripContext },
        ...limitedHistory.map((msg: ChatMessage) => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content.trim()
        })),
        { role: 'user' as const, content: message }
      ];
    }

    // Always include current date in the system prompt
    const currentDate = getCurrentDateString();
    const baseContext = `\n\nCURRENT DATE: ${currentDate}\nCURRENCY: ${currency}\n\nHelp the user establish their travel plans by asking about destinations, dates, and number of travelers. Always extract and maintain trip context from the conversation. Display all prices in ${currency === 'EUR' ? 'Euro (€)' : 'US Dollar ($)'}.`;
    
    messages[0].content += baseContext;

    // Store the user message in the database
    await MessageService.createMessage({
      trip_id: currentTripId,
      user_id: session.user.id,
      type: 'user',
      content: message,
      cards: undefined,
      follow_up: undefined,
      trip_context: undefined
    });


    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      tools: [
        flightSearchFunction, 
        accommodationSearchFunction,
        cheapestDestinationFunction,
        packageDealFunction,
        seasonalPriceFunction
      ],
      tool_choice: "auto",
      response_format: { type: "json_object" }
    });

    let aiResponseText = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
    let flightCards: Array<{ type: string; title: string; description: string; price?: string; rating?: number; location?: string; image?: string; bookingUrl?: string }> = [];
    let accommodationCards: Array<{ type: string; title: string; description: string; price?: string; rating?: number; location?: string; image?: string; bookingUrl?: string }> = [];
    let creativeCards: Array<{ type: string; title: string; description: string; price?: string; rating?: number; location?: string; image?: string; bookingUrl?: string }> = [];

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
            
            // Add currency to flight search args
            args.curr = currency;
            
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
              flightCards = transformFlightResultsToCards(flightResults, currency);
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
        } else if (toolCall.function.name === 'search_accommodation') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('API - Accommodation search args:', args);
            
            // Add currency to accommodation search args
            args.currency_code = currency;
            
            // Validate accommodation search parameters
            const validationErrors = validateAccommodationSearchParams(args);
            if (validationErrors.length > 0) {
              const errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
              console.error('Accommodation search validation errors:', validationErrors);
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
            
            const accommodationResults = await executeAccommodationSearch(args);
            console.log('API - Accommodation search results:', accommodationResults.success ? 'Success' : 'Failed');
            
            // Transform accommodation results to cards
            if (accommodationResults.success && accommodationResults.data) {
              accommodationCards = transformAccommodationResultsToCards(accommodationResults.data);
            }
            
            // Add accommodation results to the conversation
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify(accommodationResults),
              tool_call_id: toolCall.id
            });
          } catch (error) {
            console.error('Error executing accommodation search:', error);
            const userFriendlyError = handleAccommodationSearchError(error);
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify({
                success: false,
                error: userFriendlyError
              }),
              tool_call_id: toolCall.id
            });
          }
        } else if (toolCall.function.name === 'find_cheapest_destination') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('API - Cheapest destination search args:', args);
            
            const results = await executeCheapestDestinationSearch(args);
            console.log('API - Cheapest destination search results:', results.success ? 'Success' : 'Failed');
            
            // Transform results to cards
            if (results.success && results.data) {
              const destinationCards = transformCheapestDestinationResults(results.data, currency);
              creativeCards = [...creativeCards, ...destinationCards];
            }
            
            // Add results to the conversation
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify(results),
              tool_call_id: toolCall.id
            });
          } catch (error) {
            console.error('Error executing cheapest destination search:', error);
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify({
                success: false,
                error: 'Failed to search for cheapest destinations'
              }),
              tool_call_id: toolCall.id
            });
          }
        } else if (toolCall.function.name === 'find_package_deal') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('API - Package deal search args:', args);
            
            const results = await executePackageDealSearch(args);
            console.log('API - Package deal search results:', results.success ? 'Success' : 'Failed');
            
            // Transform results to cards
            if (results.success && results.data) {
              const packageCards = transformPackageDealResults(results.data, results.destination, currency);
              creativeCards = [...creativeCards, ...packageCards];
            }
            
            // Add results to the conversation
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify(results),
              tool_call_id: toolCall.id
            });
          } catch (error) {
            console.error('Error executing package deal search:', error);
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify({
                success: false,
                error: 'Failed to search for package deals'
              }),
              tool_call_id: toolCall.id
            });
          }
        } else if (toolCall.function.name === 'analyze_seasonal_prices') {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            console.log('API - Seasonal price analysis args:', args);
            
            const results = await executeSeasonalPriceAnalysis(args);
            console.log('API - Seasonal price analysis results:', results.success ? 'Success' : 'Failed');
            
            // Transform results to cards
            if (results.success && results.data) {
              const seasonalCards = transformSeasonalAnalysisResults(results.data, args.fly_to, currency);
              creativeCards = [...creativeCards, ...seasonalCards];
            }
            
            // Add results to the conversation
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify(results),
              tool_call_id: toolCall.id
            });
          } catch (error) {
            console.error('Error executing seasonal price analysis:', error);
            messages.push({
              role: 'tool' as const,
              content: JSON.stringify({
                success: false,
                error: 'Failed to analyze seasonal prices'
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

    // Update trip if AI provided new details that are different from existing data
    if (currentTripId && aiResponse["trip-context"]) {
      const newContext = aiResponse["trip-context"];
      const updates: any = {};
      let hasChanges = false;

      // Only update fields that have new values and are different from existing data
      if (newContext.from && newContext.from !== trip.origin) {
        updates.origin = newContext.from;
        hasChanges = true;
      }
      if (newContext.to && newContext.to !== trip.destination) {
        updates.destination = newContext.to;
        hasChanges = true;
      }
      if (newContext.departDate && newContext.departDate !== trip.departure_date) {
        updates.departure_date = newContext.departDate;
        hasChanges = true;
      }
      if (newContext.returnDate && newContext.returnDate !== trip.return_date) {
        updates.return_date = newContext.returnDate;
        hasChanges = true;
      }
      if (newContext.passengers && newContext.passengers !== trip.passenger_count) {
        updates.passenger_count = newContext.passengers;
        hasChanges = true;
      }

      if (hasChanges) {
        console.log('API - Updating trip with new context:', updates);
        await tripServiceServer.updateTrip(currentTripId, updates);
      } else {
        console.log('API - No changes detected in trip context');
      }
    }

    // Create the response object with actual database trip context
    const response = {
      id: Date.now(),
      type: 'ai' as const,
      content: aiResponse.message,
      cards: flightCards.length > 0 ? flightCards : 
             accommodationCards.length > 0 ? accommodationCards : 
             creativeCards.length > 0 ? creativeCards : 
             (aiResponse.suggestions || []),
      followUp: aiResponse["follow-up message"],
      tripContext: {
        from: trip.origin || '',
        to: trip.destination || '',
        departDate: trip.departure_date || '',
        returnDate: trip.return_date || '',
        passengers: trip.passenger_count || 0
      },
      tripId: currentTripId,
      timestamp: new Date()
    };

    console.log('API - Final response tripContext:', response.tripContext);

    // After parsing aiResponse and before returning response:
    await MessageService.createMessage({
      trip_id: currentTripId,
      user_id: session.user.id,
      type: 'ai',
      content: aiResponse.message,
      cards: response.cards,
      follow_up: response.followUp,
      trip_context: response.tripContext
    });

    // After successful AI response, decrease message count
    try {
      await MessageCounterServiceServer.decreaseMessageCount(session.user.id);
    } catch (error) {
      console.error('Error decreasing message count:', error);
      // Don't fail the request if counter update fails
    }

    // Track successful chat response
    posthog.capture('chat_response_successful', {
      trip_id: currentTripId,
      user_id: session.user.id,
      has_flight_cards: flightCards.length > 0,
      has_accommodation_cards: accommodationCards.length > 0,
      has_creative_cards: creativeCards.length > 0,
      total_cards: flightCards.length + accommodationCards.length + creativeCards.length,
      currency: currency
    });

    // Create response with rate limit headers
    const nextResponse = NextResponse.json(response);
    
    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      nextResponse.headers.set(key, value);
    });

    return nextResponse;

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Track chat API error
    posthog.capture('chat_api_error', {
      error_message: error instanceof Error ? error.message : 'Unknown error',
      error_type: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    });
    
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