# Travel Context System

## Overview

The travel context system ensures that the AI assistant always considers the current trip details when providing recommendations and advice. This creates a more personalized and relevant experience for users.

## How It Works

### 1. Trip Details State Management

The chat page maintains stateful trip information including:
- **From**: Departure location
- **To**: Destination
- **Departure Date**: When the trip starts
- **Return Date**: When the trip ends
- **Passengers**: Number of travelers

### 2. Automatic Extraction

The system automatically extracts trip details from user messages using enhanced pattern matching:

```typescript
// Examples of what gets extracted:
"I want to go to Paris in March" → to: "Paris", departDate: "2024-03-15"
"Planning a trip from New York to Tokyo for 2 people" → from: "New York", to: "Tokyo", passengers: 2
"Looking for flights next month" → departDate: "2024-XX-XX" (next month)
```

### 3. AI Context Injection

Every message sent to the AI includes the current trip context in the system prompt:

```
CURRENT TRIP CONTEXT:
From: New York | To: Tokyo | Departure: 2024-03-15 | Return: 2024-03-22 | Passengers: 2

Remember to always consider these trip details when providing recommendations and advice.
```

### 4. Visual Indicators

The UI provides clear visual feedback about the travel context:

- **Trip Details Sidebar**: Shows all extracted information with a green checkmark indicating AI awareness
- **Chat Window Header**: Displays current trip route and passenger count
- **Reset Button**: Allows users to clear trip details and start fresh

## Key Features

### Enhanced Pattern Matching

The system recognizes multiple ways users might express travel information:

- **Destinations**: "going to", "visit", "travel to", "headed to", "planning to go"
- **Dates**: Specific dates, month names, relative dates ("next month", "this month")
- **Passengers**: "2 people", "traveling with 3", "group of 4"

### Persistent Context

Once trip details are established, the AI always considers them for:
- Flight recommendations
- Hotel suggestions
- Activity recommendations
- Restaurant suggestions
- Pricing estimates
- Travel advice

### Context Awareness

The AI will:
- Base all recommendations on the current trip details
- Remind users of their current trip context if they ask about something unrelated
- Ask for clarification if trip details are missing
- Suggest updates when new information is provided

## Technical Implementation

### Files Modified

1. **`src/app/api/chat/route.ts`**
   - Enhanced system prompt
   - Always includes trip context in API calls

2. **`src/lib/chat-api.ts`**
   - Improved trip details extraction patterns
   - Better date parsing and passenger detection

3. **`src/app/chat/page.tsx`**
   - Stateful trip details management
   - Automatic extraction from messages

4. **`src/components/chat/TripDetailsSidebar.tsx`**
   - Visual display of travel context
   - Reset functionality

5. **`src/components/chat/ChatWindow.tsx`**
   - Context indicator in chat header

### API Flow

1. User sends message
2. System extracts any new trip details
3. Updates trip details state
4. Sends message + current trip context to AI
5. AI responds considering the travel context
6. UI updates to reflect any new trip information

## Benefits

- **Personalized Responses**: AI always considers the specific trip details
- **Consistent Context**: No need to repeat trip information in every message
- **Better Recommendations**: More accurate suggestions based on actual travel plans
- **User-Friendly**: Clear visual indicators of what the AI knows about the trip
- **Flexible**: Easy to update or reset trip details as needed 