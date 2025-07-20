# Tequila Flight API Integration Plan

## Overview

This document provides a comprehensive plan for integrating the Tequila Flight API (Kiwi.com) into our trip budget system using OpenAI's Function Calling (API Tools). The integration will enable our AI assistant to search for real flight data and provide accurate pricing and availability information to users.

## Current System Analysis

### Existing Architecture
- **Frontend**: Next.js 15 with React 19
- **Backend**: Next.js API routes
- **AI Integration**: OpenAI GPT-4 with custom system prompts
- **Database**: Supabase
- **Styling**: Tailwind CSS

### Current Chat System
- Uses OpenAI's chat completions API
- Maintains trip context throughout conversations
- Returns structured JSON responses with cards for recommendations
- Handles conversation history and context summarization

## Integration Strategy

### 1. API Tools (Function Calling) Implementation

#### 1.1 Required Parameters Analysis
Based on the Tequila API documentation, the following parameters are **required** for flight searches:

- `apikey` (header): API authentication key
- `fly_from` (query): Departure location (IATA code, city code, etc.)
- `date_from` (query): Departure date range start (dd/mm/yyyy)
- `date_to` (query): Departure date range end (dd/mm/yyyy)

#### 1.2 Optional Parameters for Enhanced Search
Key optional parameters to include:
- `fly_to`: Destination location
- `return_from` & `return_to`: Return flight dates
- `adults`, `children`, `infants`: Passenger counts
- `selected_cabins`: Cabin class preference
- `curr`: Currency preference
- `limit`: Number of results (max 1000)
- `sort`: Sort by price, duration, quality, or date

### 2. Implementation Plan

#### Phase 1: Core API Integration

##### 1.1 Environment Configuration
```bash
# Add to .env.local
TEQUILA_API_KEY=your_api_key_here
TEQUILA_BASE_URL=https://api.tequila.kiwi.com/v2
```

##### 1.2 API Service Layer
Create `src/lib/tequila-api.ts`:
```typescript
interface TequilaSearchParams {
  fly_from: string;
  fly_to?: string;
  date_from: string;
  date_to: string;
  return_from?: string;
  return_to?: string;
  adults?: number;
  children?: number;
  infants?: number;
  selected_cabins?: string;
  curr?: string;
  limit?: number;
  sort?: 'price' | 'duration' | 'quality' | 'date';
}

interface TequilaFlightResponse {
  search_id: string;
  data: TequilaFlight[];
  currency: string;
  fx_rate: number;
}

interface TequilaFlight {
  id: string;
  price: number;
  duration: {
    departure: number;
    return: number;
    total: number;
  };
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityTo: string;
  local_departure: string;
  local_arrival: string;
  airlines: string[];
  route: TequilaRoute[];
  booking_token: string;
  deep_link?: string;
}

interface TequilaRoute {
  id: string;
  flyFrom: string;
  flyTo: string;
  cityFrom: string;
  cityTo: string;
  airline: string;
  flight_no: number;
  local_departure: string;
  local_arrival: string;
}

export async function searchFlights(params: TequilaSearchParams): Promise<TequilaFlightResponse> {
  const searchParams = new URLSearchParams();
  
  // Required parameters
  searchParams.append('fly_from', params.fly_from);
  searchParams.append('date_from', params.date_from);
  searchParams.append('date_to', params.date_to);
  
  // Optional parameters
  if (params.fly_to) searchParams.append('fly_to', params.fly_to);
  if (params.return_from) searchParams.append('return_from', params.return_from);
  if (params.return_to) searchParams.append('return_to', params.return_to);
  if (params.adults) searchParams.append('adults', params.adults.toString());
  if (params.children) searchParams.append('children', params.children.toString());
  if (params.infants) searchParams.append('infants', params.infants.toString());
  if (params.selected_cabins) searchParams.append('selected_cabins', params.selected_cabins);
  if (params.curr) searchParams.append('curr', params.curr);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.sort) searchParams.append('sort', params.sort);
  
  const response = await fetch(`${process.env.TEQUILA_BASE_URL}/search?${searchParams}`, {
    headers: {
      'apikey': process.env.TEQUILA_API_KEY!,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Tequila API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}
```

#### Phase 2: OpenAI Function Calling Integration

##### 2.1 Function Definitions
Create `src/lib/openai-functions.ts`:
```typescript
import { searchFlights } from './tequila-api';

export const flightSearchFunction = {
  name: 'search_flights',
  description: 'Search for available flights using the Tequila Flight API',
  parameters: {
    type: 'object',
    properties: {
      fly_from: {
        type: 'string',
        description: 'Departure location (IATA airport code, city code, or country code). Examples: "LON", "LHR", "UK", "city:LON", "airport:LHR"'
      },
      fly_to: {
        type: 'string',
        description: 'Destination location (IATA airport code, city code, or country code). Examples: "NYC", "JFK", "US"'
      },
      date_from: {
        type: 'string',
        description: 'Departure date range start in dd/mm/yyyy format. Example: "01/04/2024"'
      },
      date_to: {
        type: 'string',
        description: 'Departure date range end in dd/mm/yyyy format. Example: "03/04/2024"'
      },
      return_from: {
        type: 'string',
        description: 'Return flight departure date in dd/mm/yyyy format. Example: "08/04/2024"'
      },
      return_to: {
        type: 'string',
        description: 'Return flight departure date end in dd/mm/yyyy format. Example: "10/04/2024"'
      },
      adults: {
        type: 'number',
        description: 'Number of adult passengers (default: 1)',
        minimum: 1,
        maximum: 9
      },
      children: {
        type: 'number',
        description: 'Number of child passengers (default: 0)',
        minimum: 0,
        maximum: 9
      },
      infants: {
        type: 'number',
        description: 'Number of infant passengers (default: 0)',
        minimum: 0,
        maximum: 9
      },
      selected_cabins: {
        type: 'string',
        description: 'Preferred cabin class. M=economy, W=economy premium, C=business, F=first class',
        enum: ['M', 'W', 'C', 'F']
      },
      curr: {
        type: 'string',
        description: 'Currency for pricing. Default: USD',
        default: 'USD'
      },
      limit: {
        type: 'number',
        description: 'Maximum number of results (max 1000)',
        minimum: 1,
        maximum: 1000,
        default: 50
      },
      sort: {
        type: 'string',
        description: 'Sort results by',
        enum: ['price', 'duration', 'quality', 'date'],
        default: 'price'
      }
    },
    required: ['fly_from', 'date_from', 'date_to']
  }
};

export async function executeFlightSearch(args: any) {
  try {
    const result = await searchFlights(args);
    return {
      success: true,
      data: result.data,
      currency: result.currency,
      search_id: result.search_id
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
```

##### 2.2 Updated Chat API Route
Modify `src/app/api/chat/route.ts`:
```typescript
import { flightSearchFunction, executeFlightSearch } from '@/lib/openai-functions';

// Update the OpenAI call to include tools
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages,
  temperature: 0.7,
  max_tokens: 1500,
  tools: [flightSearchFunction],
  tool_choice: "auto"
});

// Handle tool calls
const responseMessage = completion.choices[0]?.message;
if (responseMessage?.tool_calls) {
  for (const toolCall of responseMessage.tool_calls) {
    if (toolCall.function.name === 'search_flights') {
      const args = JSON.parse(toolCall.function.arguments);
      const flightResults = await executeFlightSearch(args);
      
      // Add flight results to the conversation
      messages.push({
        role: 'tool',
        content: JSON.stringify(flightResults),
        tool_call_id: toolCall.id
      });
    }
  }
  
  // Get final response from OpenAI
  const finalCompletion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.7,
    max_tokens: 1500
  });
  
  aiResponseText = finalCompletion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';
}
```

#### Phase 3: Response Processing

##### 3.1 Flight Data Transformation
Create `src/lib/flight-transformer.ts`:
```typescript
import { TequilaFlight } from './tequila-api';

export function transformFlightToCard(flight: TequilaFlight) {
  const durationHours = Math.floor(flight.duration.total / 3600);
  const durationMinutes = Math.floor((flight.duration.total % 3600) / 60);
  
  return {
    type: 'flight' as const,
    title: `${flight.cityFrom} → ${flight.cityTo}`,
    description: `${flight.airlines.join(', ')} • ${durationHours}h ${durationMinutes}m`,
    price: `$${flight.price}`,
    rating: 4.5, // Default rating
    location: `${flight.cityFrom} to ${flight.cityTo}`,
    bookingUrl: flight.deep_link,
    flightDetails: {
      departure: flight.local_departure,
      arrival: flight.local_arrival,
      airlines: flight.airlines,
      duration: flight.duration,
      bookingToken: flight.booking_token
    }
  };
}
```

##### 3.2 Updated System Prompt
Add to the system prompt in `src/app/api/chat/route.ts`:
```typescript
const SYSTEM_PROMPT = `You are an AI travel assistant that helps users plan their trips. You should:

1. Extract and maintain trip context from EVERY user message
2. Provide helpful, personalized travel recommendations based on the specific trip details
3. Be conversational and friendly
4. Ask follow-up questions when needed
5. Provide realistic pricing and details based on the destination and context
6. Give specific, actionable advice rather than generic suggestions
7. Always reference the current trip details when making recommendations

FLIGHT SEARCH CAPABILITY:
- You can search for real flight data using the search_flights function
- Use this function when users ask about flights, pricing, or availability
- Always use the trip context (from, to, dates, passengers) when searching
- Present flight results in a user-friendly format with pricing and duration
- Include booking links when available

CRITICAL: You MUST extract and update trip details from EVERY user message. If the user mentions:
- A destination (city, country, place): update the "to" field
- An origin location: update the "from" field  
- Travel dates (month, year, specific dates): update "departDate" and "returnDate"
- Number of travelers: update the "passengers" field

You are responsible for maintaining the complete trip context throughout the conversation. Always preserve existing trip details and add new information as it becomes available.

IMPORTANT: You must always consider the current trip context when responding. If trip details are provided, base ALL your recommendations on those specific details. If the user asks about something that doesn't match the current trip context, gently remind them of the current trip details and ask if they want to change their plans.

When providing recommendations:
- For flights: Use the search_flights function to get real data, mention airlines, duration, and actual prices
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
  "followUpMessage": "The specific next step or follow-up question (this will be displayed separately in the Next Steps section)",
  "tripContext": {
    "from": "Updated origin location",
    "to": "Updated destination", 
    "departDate": "Updated departure date (YYYY-MM-DD)",
    "returnDate": "Updated return date (YYYY-MM-DD)",
    "passengers": 2
  },
  "intent": "detected_intent_here",
  "functionToCall": "function_name_if_needed"
}

MANDATORY: You MUST ALWAYS include the tripContext field in your response, even if no trip details are known. If no trip details are available, use empty strings for text fields and 0 for passengers.

The cards array is optional - only include it when you want to suggest specific places, flights, hotels, etc. The tripContext should always reflect the current trip details, updating them if new information is provided in the user's message.

IMPORTANT FOR FOLLOW-UP: The "followUpMessage" field should contain the specific next step or question, separate from your main message. The main message should be conversational, and the followUpMessage should be the actionable part. 

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
```

### 3. Error Handling and Validation

#### 3.1 Input Validation
```typescript
function validateFlightSearchParams(params: any): string[] {
  const errors: string[] = [];
  
  if (!params.fly_from) errors.push('Departure location is required');
  if (!params.date_from) errors.push('Departure date from is required');
  if (!params.date_to) errors.push('Departure date to is required');
  
  // Validate date format
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (params.date_from && !dateRegex.test(params.date_from)) {
    errors.push('Date format must be dd/mm/yyyy');
  }
  if (params.date_to && !dateRegex.test(params.date_to)) {
    errors.push('Date format must be dd/mm/yyyy');
  }
  
  return errors;
}
```

#### 3.2 Error Response Handling
```typescript
function handleFlightSearchError(error: any): string {
  if (error.message.includes('Not recognized location')) {
    return 'I couldn\'t find that location. Please try using a different airport code or city name.';
  }
  if (error.message.includes('400')) {
    return 'There was an issue with the search parameters. Please check your dates and locations.';
  }
  return 'Sorry, I encountered an error while searching for flights. Please try again.';
}
```

### 4. Testing Strategy

#### 4.1 Unit Tests
Create `src/lib/__tests__/tequila-api.test.ts`:
```typescript
import { searchFlights } from '../tequila-api';

describe('Tequila API', () => {
  it('should search flights with valid parameters', async () => {
    const params = {
      fly_from: 'LON',
      fly_to: 'NYC',
      date_from: '01/04/2024',
      date_to: '03/04/2024',
      adults: 2
    };
    
    const result = await searchFlights(params);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('currency');
  });
});
```

#### 4.2 Integration Tests
Create `src/app/api/__tests__/chat.test.ts`:
```typescript
import { POST } from '../chat/route';

describe('Chat API with Flight Search', () => {
  it('should handle flight search requests', async () => {
    const request = new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I need flights from London to New York for April 1-3, 2024',
        conversationHistory: []
      })
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.cards).toBeDefined();
    expect(data.cards.some(card => card.type === 'flight')).toBe(true);
  });
});
```

### 5. Deployment Considerations

#### 5.1 Environment Variables
```bash
# Production environment variables
TEQUILA_API_KEY=your_production_api_key
TEQUILA_BASE_URL=https://api.tequila.kiwi.com/v2
OPENAI_API_KEY=your_openai_api_key
```

#### 5.2 Rate Limiting
```typescript
// Add rate limiting to prevent API abuse
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 6. Monitoring and Analytics

#### 6.1 API Usage Tracking
```typescript
// Track API usage for monitoring
function trackFlightSearch(params: TequilaSearchParams, result: any) {
  console.log('Flight search:', {
    from: params.fly_from,
    to: params.fly_to,
    date: params.date_from,
    results: result.data?.length || 0,
    timestamp: new Date().toISOString()
  });
}
```

### 7. Future Enhancements

#### 7.1 Additional Features
- **Price Alerts**: Track price changes for specific routes
- **Multi-city Search**: Support for complex itineraries
- **Airport Autocomplete**: Help users find correct airport codes
- **Flight Comparison**: Compare multiple flight options
- **Booking Integration**: Direct booking through the platform

#### 7.2 Performance Optimizations
- **Caching**: Cache flight search results for short periods
- **Pagination**: Handle large result sets efficiently
- **Background Processing**: Process flight searches asynchronously

## Implementation Checklist

- [ ] Set up environment variables
- [ ] Create Tequila API service layer
- [ ] Implement OpenAI function calling
- [ ] Update chat API route
- [ ] Add flight data transformation
- [ ] Implement error handling
- [ ] Add input validation
- [ ] Create unit tests
- [ ] Test integration
- [ ] Deploy to production
- [ ] Monitor API usage
- [ ] Document API usage

## Conclusion

This integration plan provides a comprehensive approach to adding real flight search capabilities to our AI travel assistant. The implementation is designed to be simple and maintainable while providing a robust foundation for future enhancements. The use of OpenAI's Function Calling ensures that the AI can intelligently search for flights based on user context and provide accurate, real-time information. 