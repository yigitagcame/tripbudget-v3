# Trip Context Persistence System

## Overview

The trip context persistence system ensures that trip records are properly tied to OpenAI and that the context persists throughout the entire chat session. Once trip context is established, OpenAI uses it from the database and does not change it unless the user explicitly provides new information.

## Key Requirements

1. **Trip records must be tied to OpenAI**: Each chat session has a unique trip ID that links to a database record
2. **Trip context must be set via OpenAI**: Trip details are extracted from user input by the AI assistant
3. **Context must persist from database**: Once set, OpenAI must use the context from the database
4. **Context must not change during chat**: The context should remain stable unless user provides new information

## System Architecture

### 1. Database Storage
- **Table**: `trips`
- **Fields**: `trip_id`, `user_id`, `origin`, `destination`, `departure_date`, `return_date`, `passenger_count`
- **Access Control**: Row Level Security ensures users can only access their own trips

### 2. Context Flow
```
User Message → API → Load Trip Context from DB → Inject into OpenAI → AI Response → Update DB (if changes) → Return DB Context
```

### 3. Key Components

#### A. Trip Context Loading (`createTripContextString`)
```typescript
function createTripContextString(tripData: any): string {
  if (!tripData) return '';
  
  const hasExistingContext = tripData.origin || tripData.destination || 
                           tripData.departure_date || tripData.return_date || 
                           tripData.passenger_count;
  
  if (!hasExistingContext) return '';

  return `\n\nCURRENT TRIP CONTEXT FROM DATABASE:
From: ${tripData.origin || 'Not specified'}
To: ${tripData.destination || 'Not specified'}
Departure Date: ${tripData.departure_date || 'Not specified'}
Return Date: ${tripData.return_date || 'Not specified'}
Passengers: ${tripData.passenger_count || 0}

CRITICAL: You MUST preserve and build upon these existing trip details. Only update fields when the user provides new information. Always consider these details when making recommendations.`;
}
```

#### B. OpenAI System Prompt Injection
The existing trip context is injected into the OpenAI system prompt:
```typescript
messages = [
  { 
    role: 'system', 
    content: SYSTEM_PROMPT + existingTripContext 
  },
  // ... conversation history
];
```

#### C. Conservative Update Logic
The system only updates the database when there are actual changes:
```typescript
// Only update fields that have new values and are different from existing data
if (newContext.from && newContext.from !== trip.origin) {
  updates.origin = newContext.from;
  hasChanges = true;
}
// ... similar logic for other fields

if (hasChanges) {
  await tripService.updateTrip(currentTripId, updates);
}
```

#### D. Response Context from Database
The API response always reflects the actual database state:
```typescript
tripContext: {
  from: trip.origin || '',
  to: trip.destination || '',
  departDate: trip.departure_date || '',
  returnDate: trip.return_date || '',
  passengers: trip.passenger_count || 0
}
```

## Implementation Details

### 1. API Route (`src/app/api/chat/route.ts`)

#### Context Loading
- Loads trip data from database at the start of each request
- Creates context string from database data
- Injects context into OpenAI system prompt

#### Conservative Updates
- Compares AI response context with existing database data
- Only updates fields that have actual changes
- Logs when updates occur vs. when no changes are detected

#### Response Consistency
- Always returns the actual database state in tripContext
- Ensures frontend and database stay synchronized

### 2. Frontend (`src/app/chat/[tripId]/page.tsx`)

#### Initial Load
- Loads trip details from database on component mount
- Sets local state to match database state

#### Conservative Updates
- Only updates local state when there are actual changes
- Prevents unnecessary re-renders
- Maintains consistency with database

### 3. System Prompt Updates

The system prompt now explicitly instructs OpenAI to:
- Preserve existing trip context from the system prompt
- Only update fields when user explicitly provides new information
- Use existing trip context as the foundation for recommendations
- Never overwrite existing context unless user provides new data

## Behavior Examples

### Scenario 1: New Trip
1. User starts new chat
2. User says: "I want to go to Paris in March for 2 people"
3. AI extracts: destination="Paris", departDate="2024-03-15", passengers=2
4. Database is updated with these details
5. Future messages will preserve this context

### Scenario 2: Existing Trip
1. User returns to existing chat
2. Database contains: destination="Paris", departDate="2024-03-15", passengers=2
3. AI receives this context in system prompt
4. User asks: "What about hotels?"
5. AI responds about hotels in Paris, preserving existing context
6. Database is NOT updated (no new information provided)

### Scenario 3: Context Update
1. User has existing trip to Paris
2. User says: "Actually, I want to go to Tokyo instead"
3. AI detects new destination information
4. Database is updated: destination="Tokyo"
5. Future messages will use Tokyo as destination

## Benefits

1. **Persistent Context**: Trip details survive chat session restarts
2. **Consistent Experience**: AI always considers the current trip context
3. **Efficient Updates**: Only updates database when necessary
4. **User Control**: Users can update trip details by providing new information
5. **Data Integrity**: Database is the source of truth for trip context

## Testing

### Manual Testing
1. Start new chat and provide trip details
2. Refresh page or start new session
3. Send message - AI should remember previous context
4. Try to change details - AI should only update when you provide new info

### Automated Testing
- `scripts/test-trip-context-persistence.ts` - Verifies system behavior
- Database integration tests
- API response validation tests

## Error Handling

1. **Missing Trip**: Redirects to trips page
2. **Access Denied**: Returns 404 for unauthorized access
3. **Database Errors**: Graceful fallback with error logging
4. **Invalid Context**: Validates trip data before use

## Future Enhancements

1. **Context Versioning**: Track changes to trip context over time
2. **Context Merging**: Handle conflicting information intelligently
3. **Context Validation**: Validate trip details (dates, locations, etc.)
4. **Context Sharing**: Allow sharing trip context between users
5. **Context Templates**: Pre-defined trip templates for common scenarios 