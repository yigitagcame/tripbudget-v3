import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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
  cards?: Card[];
  followUp: string;
  tripContext: TripDetails;
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



// System prompt for the AI travel assistant
const SYSTEM_PROMPT = `You are an AI travel assistant that helps users plan their trips. You should:

1. Extract and maintain trip context from EVERY user message
2. Provide helpful, personalized travel recommendations based on the specific trip details
3. Be conversational and friendly
4. Ask follow-up questions when needed
5. Provide realistic pricing and details based on the destination and context
6. Give specific, actionable advice rather than generic suggestions
7. Always reference the current trip details when making recommendations

CRITICAL: You MUST extract and update trip details from EVERY user message. If the user mentions:
- A destination (city, country, place): update the "to" field
- An origin location: update the "from" field  
- Travel dates (month, year, specific dates): update "departDate" and "returnDate"
- Number of travelers: update the "passengers" field

You are responsible for maintaining the complete trip context throughout the conversation. Always preserve existing trip details and add new information as it becomes available.

IMPORTANT: You must always consider the current trip context when responding. If trip details are provided, base ALL your recommendations on those specific details. If the user asks about something that doesn't match the current trip context, gently remind them of the current trip details and ask if they want to change their plans.

When providing recommendations:
- For flights: mention realistic airlines, duration, and price ranges for the specific route
- For hotels: suggest appropriate accommodation types and price ranges for the destination
- For restaurants: recommend cuisine types and price ranges typical for the location
- For activities: suggest relevant attractions and experiences for the destination
- Always consider the number of passengers when making recommendations
- Always consider the current date when making recommendations about availability, seasonal events, or time-sensitive information

CRITICAL: You must respond in the following JSON format ONLY:

{
  "message": "Your conversational response to the user (DO NOT include the next step question here)",
  "cards": [
    {
      "type": "flight|hotel|restaurant|activity|transport|place",
      "title": "Name of the recommendation",
      "description": "Brief description",
      "price": "Price range or specific price",
      "rating": 4.5,
      "location": "Location details",
      "image": "URL to image (optional)",
      "bookingUrl": "URL to booking page (optional)"
    }
  ],
  "followUp": "The specific next step or follow-up question (this will be displayed separately in the Next Steps section)",
  "tripContext": {
    "from": "Updated origin location",
    "to": "Updated destination", 
    "departDate": "Updated departure date (YYYY-MM-DD)",
    "returnDate": "Updated return date (YYYY-MM-DD)",
    "passengers": 2
  }
}

MANDATORY: You MUST ALWAYS include the tripContext field in your response, even if no trip details are known. If no trip details are available, use empty strings for text fields and 0 for passengers.

The cards array is optional - only include it when you want to suggest specific places, flights, hotels, etc. The tripContext should always reflect the current trip details, updating them if new information is provided in the user's message.

IMPORTANT FOR FOLLOW-UP: The "followUp" field should contain the specific next step or question, separate from your main message. The main message should be conversational, and the followUp should be the actionable part. 

FORMATTING RULES:
- If asking for multiple pieces of information, format as a bulleted list
- Use "- " for each bullet point
- Keep each bullet point concise and clear

For example:

MESSAGE: "That sounds like a fantastic idea! Riga is a beautiful city especially during the summer."
FOLLOW-UP: "To provide the best assistance, could you please provide me with:
- the dates of your travel
- the city you'll be traveling from
- the number of people joining the trip?"

MESSAGE: "I found some great flight options for your trip to Tokyo!"
FOLLOW-UP: "Would you like me to help you find hotels in Tokyo, or would you prefer to explore activities first?"

MESSAGE: "Paris in March is absolutely magical! The weather is starting to warm up and the crowds are smaller than peak season."
FOLLOW-UP: "Could you please provide:
- your departure city
- the number of people traveling?"

Always be helpful and provide actionable advice based on the user's specific trip details.`;

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
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

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

    // Prepare conversation history for OpenAI with length limits
    const MAX_CONVERSATION_MESSAGES = 20; // Limit to last 20 messages to manage token usage
    const MAX_MESSAGES_FOR_SUMMARY = 30; // If more than this, use summary instead
    
    const filteredHistory = conversationHistory
      .filter((msg: ChatMessage) => msg.content && msg.content.trim() !== '');
    
    let messages;
    
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
    const tripContext = `\n\nCURRENT DATE: ${currentDate}\n\nHelp the user establish their travel plans by asking about destinations, dates, and number of travelers. Always extract and maintain trip context from the conversation.`;
    
    messages[0].content += tripContext;



    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const aiResponseText = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

    // Parse the JSON response from AI
    let aiResponse: AIResponse;
    try {
      // First, try to parse the entire response as JSON
      try {
        const directParse = JSON.parse(aiResponseText);
        if (directParse.message && directParse.tripContext) {
          // The AI returned a complete JSON response
          aiResponse = directParse;
          console.log('API - Direct JSON parse successful, tripContext:', aiResponse.tripContext);
        } else {
          throw new Error('Not a complete AI response');
        }
      } catch (directParseError) {
        // If direct parse fails, try to extract JSON from the response
        const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiResponse = JSON.parse(jsonMatch[0]);
          console.log('API - Extracted JSON parse successful, tripContext:', aiResponse.tripContext);
        } else {
          throw new Error('No JSON found in response');
        }
      }
      
      // Validate that followUp is present and not empty
      if (!aiResponse.followUp || aiResponse.followUp.trim() === '') {
        console.warn('AI response missing followUp, generating one from message');
        // Try to extract a follow-up from the message content
        const messageContent = aiResponse.message || aiResponseText;
        if (messageContent.includes('Could you') || messageContent.includes('Please') || messageContent.includes('Would you')) {
          // Extract the question part
          const questionMatch = messageContent.match(/(Could you|Please|Would you)[^.!?]*[.!?]?/);
          aiResponse.followUp = questionMatch ? questionMatch[0].trim() : "What would you like to know about your trip?";
        } else {
          aiResponse.followUp = "What would you like to know about your trip?";
        }
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw AI response:', aiResponseText);
      // Fallback response
      aiResponse = {
        message: aiResponseText,
        followUp: "Could you please tell me where you'd like to go and when you're planning to travel?",
        tripContext: {
          from: '',
          to: '',
          departDate: '',
          returnDate: '',
          passengers: 0
        }
      };
    }

    // Validate and ensure all required fields are present
    if (!aiResponse.message || aiResponse.message.trim() === '') {
      aiResponse.message = "I'm here to help you plan your trip!";
    }
    
    if (!aiResponse.followUp || aiResponse.followUp.trim() === '') {
      aiResponse.followUp = "Could you please tell me where you'd like to go and when you're planning to travel?";
    }
    
    if (!aiResponse.tripContext) {
      aiResponse.tripContext = {
        from: '',
        to: '',
        departDate: '',
        returnDate: '',
        passengers: 0
      };
    }

    // Create the response object
    const response = {
      id: Date.now(),
      type: 'ai' as const,
      content: aiResponse.message,
      cards: aiResponse.cards || [],
      followUp: aiResponse.followUp,
      tripContext: aiResponse.tripContext,
      timestamp: new Date()
    };

    console.log('API - Final response tripContext:', response.tripContext);

    return NextResponse.json(response);

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