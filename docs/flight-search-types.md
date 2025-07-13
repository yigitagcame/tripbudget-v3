# Flight Search Types

## Overview

The flight search system now supports three different search types to provide users with more targeted flight recommendations based on their preferences.

## Search Types

### 1. Cheapest (`cheapest`)
- **Purpose**: Find the most affordable flight options
- **Sorting**: Results sorted by price (lowest first)
- **Use case**: Budget-conscious travelers, cost-sensitive searches
- **Trigger words**: "cheapest", "lowest price", "budget", "affordable"

### 2. Fastest (`fastest`)
- **Purpose**: Find the quickest flight options
- **Sorting**: Results sorted by duration (shortest first)
- **Use case**: Business travelers, time-sensitive trips
- **Trigger words**: "fastest", "quickest", "shortest duration", "time"

### 3. Best (`best`)
- **Purpose**: Find the highest quality flight options
- **Sorting**: Results sorted by quality (best first)
- **Use case**: Premium travelers, default recommendation
- **Trigger words**: "best", "premium", "quality", or no specific preference

## Implementation Details

### API Parameters

The flight search function now accepts a `search_type` parameter:

```typescript
{
  fly_from: "LON",
  fly_to: "NYC",
  date_from: "01/08/2025",
  date_to: "03/08/2025",
  search_type: "cheapest" | "fastest" | "best"
}
```

### Automatic Configuration

Based on the search type, the system automatically configures:

| Search Type | Sort Parameter | Limit | Description |
|-------------|----------------|-------|-------------|
| `cheapest`  | `price`        | 2     | Lowest price flights |
| `fastest`   | `duration`     | 2     | Shortest duration flights |
| `best`      | `quality`      | 2     | Highest quality flights |

### Default Behavior

- If no `search_type` is specified, the system defaults to `best`
- All search types return a maximum of 2 results to avoid overwhelming users
- The AI assistant automatically detects user preferences and selects the appropriate search type

## Usage Examples

### User Requests

1. **Cheapest flights**:
   ```
   User: "I need the cheapest flights from London to New York"
   AI: Uses search_type: "cheapest"
   ```

2. **Fastest flights**:
   ```
   User: "Show me the fastest flights from London to New York"
   AI: Uses search_type: "fastest"
   ```

3. **Best flights**:
   ```
   User: "I want the best flights from London to New York"
   AI: Uses search_type: "best"
   ```

4. **Generic request**:
   ```
   User: "Find flights from London to New York"
   AI: Uses search_type: "best" (default)
   ```

### API Response

Each search returns up to 2 flight options with relevant information:

```json
{
  "success": true,
  "data": [
    {
      "id": "flight_id",
      "price": 450.50,
      "duration": { "total": 25200 },
      "airlines": ["British Airways"],
      "flyFrom": "LON",
      "flyTo": "NYC",
      "local_departure": "2025-08-01T10:00:00.000Z",
      "local_arrival": "2025-08-01T13:00:00.000Z"
    }
  ],
  "search_type": "cheapest",
  "currency": "USD"
}
```

## Testing

### Manual Testing

Run the flight search types test:

```bash
npm run test:flight-types
```

This test verifies:
- All three search types work correctly
- Results are properly sorted
- Default behavior works as expected
- Response limits are enforced

### Chat API Testing

Test the AI assistant integration:

```bash
npm run test:chat-flight-types
```

This test verifies:
- AI correctly detects search preferences
- Appropriate search types are used
- Flight cards are returned correctly

## Configuration

### Environment Variables

Ensure these environment variables are set:

```bash
TEQUILA_API_KEY=your_api_key
TEQUILA_BASE_URL=https://api.tequila.kiwi.com/v2
OPENAI_API_KEY=your_openai_key
```

### System Prompt

The AI assistant is instructed to detect search preferences:

```
FLIGHT SEARCH:
- Detect user preferences for flight search type:
  * "cheapest" - when user asks for cheapest, lowest price, budget options
  * "fastest" - when user asks for fastest, quickest, shortest duration
  * "best" - when user asks for best, premium, or doesn't specify (default)
- Limit results to 2 flights per search to avoid overwhelming the user
```

## Benefits

1. **User Experience**: More relevant flight recommendations based on preferences
2. **Performance**: Limited results reduce API costs and response times
3. **Clarity**: Users get focused options instead of overwhelming choices
4. **Flexibility**: Supports different travel styles and budgets

## Future Enhancements

Potential improvements for future versions:

1. **Hybrid searches**: Combine multiple criteria (e.g., "cheapest but under 8 hours")
2. **User preferences**: Store user's preferred search type in their profile
3. **Advanced filtering**: Add more granular filters (airlines, stops, etc.)
4. **Comparison mode**: Show multiple search types side by side 