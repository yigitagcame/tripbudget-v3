# JSON Response Format

## Overview

The AI chat API now returns responses in a structured JSON format that includes multiple data points to provide a richer and more interactive experience.

## Response Structure

### Main Response Object

```typescript
{
  id: number;
  type: 'ai';
  content: string;        // The main AI message
  timestamp: Date;
  cards: Card[];          // Optional recommendation cards
  followUp: string;       // Follow-up question/suggestion
  tripContext: TripDetails; // Updated trip information
}
```

### Data Points

#### 1. Message (content)
- **Type**: `string`
- **Description**: The main conversational response from the AI
- **Example**: "I found some great flight options for your trip to Tokyo!"

#### 2. Cards (optional)
- **Type**: `Card[]`
- **Description**: Array of recommendation cards for flights, hotels, restaurants, activities, etc.
- **Optional**: Only included when AI wants to suggest specific places or services

```typescript
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
```

**Card Types:**
- `flight`: Airline flights and routes
- `hotel`: Accommodation options
- `restaurant`: Dining recommendations
- `activity`: Tourist activities and attractions
- `transport`: Transportation options
- `place`: General places of interest

#### 3. Follow-up
- **Type**: `string`
- **Description**: A follow-up question or suggestion for the next step in trip planning
- **Example**: "Would you like me to help you find hotels in Tokyo, or would you prefer to look at activities first?"

#### 4. Trip Context
- **Type**: `TripDetails`
- **Description**: Always includes the current trip information to keep the frontend synchronized

```typescript
interface TripDetails {
  from: string;           // Origin location
  to: string;             // Destination
  departDate: string;     // Departure date (YYYY-MM-DD)
  returnDate: string;     // Return date (YYYY-MM-DD)
  passengers: number;     // Number of travelers
}
```

## Example API Response

```json
{
  "id": 1703123456789,
  "type": "ai",
  "content": "I found some excellent flight options for your trip from New York to Tokyo! Here are a few recommendations that would work well for your dates in March.",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "cards": [
    {
      "type": "flight",
      "title": "Japan Airlines JL006",
      "description": "Direct flight from JFK to Narita, 14h 15m duration",
      "price": "$1,200 - $1,800",
      "rating": 4.5,
      "location": "JFK → NRT",
      "bookingUrl": "https://example.com/book/jl006"
    },
    {
      "type": "flight",
      "title": "United Airlines UA79",
      "description": "Direct flight from Newark to Narita, 13h 45m duration",
      "price": "$1,100 - $1,600",
      "rating": 4.2,
      "location": "EWR → NRT",
      "bookingUrl": "https://example.com/book/ua79"
    }
  ],
  "followUp": "These flights look great! Would you like me to help you find hotels in Tokyo, or would you prefer to explore some activities and attractions first?",
  "tripContext": {
    "from": "New York",
    "to": "Tokyo",
    "departDate": "2024-03-15",
    "returnDate": "2024-03-22",
    "passengers": 2
  }
}
```

## Frontend Integration

### Chat Messages
The frontend displays:
1. **Main message** in the chat bubble
2. **Recommendation cards** below the message (if any)
3. **Follow-up message** in a highlighted box
4. **Trip context** is used to update the sidebar

### Trip Plan Integration
- Users can click "Add to Trip" on recommendation cards
- Cards are added to the trip plan sidebar
- Trip plan maintains the same card structure

### Trip Details Synchronization
- The `tripContext` from each response updates the trip details sidebar
- Ensures frontend always has the latest trip information
- Allows AI to update trip details based on conversation

## Benefits

1. **Structured Data**: Clear separation of different types of information
2. **Rich Recommendations**: Detailed cards with pricing, ratings, and booking links
3. **Guided Experience**: Follow-up questions keep the conversation flowing
4. **State Synchronization**: Trip context keeps frontend and AI in sync
5. **Interactive Elements**: Users can add recommendations to their trip plan
6. **Consistent Format**: All responses follow the same structure

## Error Handling

If the AI fails to return proper JSON, the system falls back to:
```json
{
  "message": "Original AI response text",
  "followUp": "How can I help you with your trip planning?",
  "tripContext": "Current trip details or empty defaults"
}
``` 