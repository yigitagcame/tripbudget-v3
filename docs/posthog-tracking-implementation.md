# PostHog Event Tracking Implementation

## Overview
This document outlines the implementation of PostHog event tracking for key user actions in the trip-budget application.

## Events Tracked

### 1. Chat Message Sent
**Event Name:** `chat_message_sent`

**Triggered When:** User sends a message in the chat interface

**Location:** `src/app/chat/[tripId]/page.tsx` - `handleSendMessage` function

**Properties Tracked:**
- `trip_id`: The ID of the current trip
- `message_length`: Length of the sent message
- `currency`: Selected currency (EUR/USD)
- `user_id`: User ID
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackChatMessage({
  trip_id: tripId,
  message_length: message.trim().length,
  currency: currency || 'EUR',
  user_id: user?.id
});
```

### 2. Card Saved
**Event Name:** `card_saved`

**Triggered When:** User clicks "Add to Trip" button on a recommendation card

**Location:** 
- `src/app/chat/[tripId]/page.tsx` - `handleAddToTripPlan` function
- `src/components/chat/RecommendationCards.tsx` - "Add to Trip" button click

**Properties Tracked:**
- `card_type`: Type of card (flight, hotel, restaurant, etc.)
- `card_title`: Title of the card
- `trip_id`: The ID of the current trip
- `user_id`: User ID
- `card_location`: Location of the recommendation
- `card_price`: Price information
- `card_rating`: Rating if available
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackSaveCard(card.type, card.title, {
  trip_id: tripId,
  user_id: user?.id,
  card_location: card.location,
  card_price: card.price,
  card_rating: card.rating
});
```

### 3. Booking Link Clicked
**Event Name:** `booking_link_clicked`

**Triggered When:** User clicks "Book Now" link on a recommendation card

**Location:** `src/components/chat/RecommendationCards.tsx` - "Book Now" link click

**Properties Tracked:**
- `card_type`: Type of card (flight, hotel, restaurant, etc.)
- `card_title`: Title of the card
- `booking_url`: The URL being clicked
- `card_location`: Location of the recommendation
- `card_price`: Price information
- `card_rating`: Rating if available
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackBookingLinkClick(card.type, card.title, card.bookingUrl!, {
  card_location: card.location,
  card_price: card.price,
  card_rating: card.rating
});
```

### 4. Trip Created
**Event Name:** `trip_created`

**Triggered When:** A new trip is created in the system

**Location:** `src/lib/trip-service.ts` - `createTrip` function

**Properties Tracked:**
- `trip_id`: The ID of the created trip
- `user_id`: User ID
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackTripCreated(tripId, {
  user_id: userId
});
```

### 5. Trip Accessed
**Event Name:** `trip_accessed`

**Triggered When:** User visits an existing trip

**Location:** `src/app/chat/[tripId]/page.tsx` - `useEffect` for trip loading

**Properties Tracked:**
- `trip_id`: The ID of the accessed trip
- `user_id`: User ID
- `trip_origin`: Origin location (if set)
- `trip_destination`: Destination location (if set)
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackTripAccessed(tripId, {
  user_id: user.id,
  trip_origin: trip?.origin,
  trip_destination: trip?.destination
});
```

### 6. Trip Details Updated
**Event Name:** `trip_details_updated`

**Triggered When:** AI updates trip context with new information

**Location:** `src/app/chat/[tripId]/page.tsx` - `handleSendMessage` function

**Properties Tracked:**
- `trip_id`: The ID of the trip
- `updated_fields`: Array of field names that were updated
- `user_id`: User ID
- `timestamp`: When the event occurred

### 7. Referral Bonus Earned
**Event Name:** `referral_bonus_earned`

**Triggered When:** User successfully uses a referral code

**Location:** `src/app/auth/callback/page.tsx` - Referral code processing

**Properties Tracked:**
- `referral_code`: The referral code used
- `bonus_amount`: Number of bonus messages earned
- `user_id`: User ID
- `user_email`: User email
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackReferralBonusEarned(referralCode, 25, {
  user_id: session.user.id,
  user_email: session.user.email
});
```

### 8. Message Limit Reached
**Event Name:** `message_limit_reached`

**Triggered When:** User runs out of messages

**Location:** `src/app/api/chat/route.ts` - Message counter check

**Properties Tracked:**
- `user_id`: User ID
- `trip_id`: Current trip ID
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackMessageLimitReached({
  user_id: session.user.id,
  trip_id: tripId
});
```

### 9. Get More Messages Modal Opened
**Event Name:** `get_more_messages_modal_opened`

**Triggered When:** User opens the "Get More Messages" modal

**Location:** `src/components/chat/GetMoreMessagesModal.tsx` - Modal opening

**Properties Tracked:**
- `user_id`: User ID
- `current_message_count`: Current message count
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackGetMoreMessagesModalOpened({
  user_id: user.id,
  current_message_count: currentMessageCount
});
```

### 10. Currency Changed
**Event Name:** `currency_changed`

**Triggered When:** User switches between EUR and USD

**Location:** `src/components/chat/ChatWindow.tsx` - Currency dropdown

**Properties Tracked:**
- `from_currency`: Previous currency
- `to_currency`: New currency
- `trip_id`: Current trip ID
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackCurrencyChanged(currency, newCurrency, {
  trip_id: tripDetails?.from || 'unknown'
});
```

### 11. Error Occurred
**Event Name:** `error_occurred`

**Triggered When:** Any application error occurs

**Location:** Various error handling locations

**Properties Tracked:**
- `error_type`: Type of error
- `error_message`: Error message
- `user_id`: User ID (if available)
- `timestamp`: When the event occurred

### 12. Rate Limit Hit
**Event Name:** `rate_limit_hit`

**Triggered When:** User hits rate limits

**Location:** Rate limiting middleware

**Properties Tracked:**
- `endpoint`: API endpoint that was rate limited
- `user_id`: User ID (if available)
- `timestamp`: When the event occurred

### 13. API Error
**Event Name:** `api_error`

**Triggered When:** External API calls fail

**Location:** `src/app/api/chat/route.ts` - Error handling

**Properties Tracked:**
- `api_name`: Name of the API that failed
- `error_message`: Error message
- `timestamp`: When the event occurred

**Implementation:**
```typescript
trackApiError('chat_api', error instanceof Error ? error.message : 'Unknown error', {
  timestamp: new Date().toISOString()
});
```

## PostHog Utility Functions

### Enhanced PostHog Library
Location: `src/lib/posthog.ts`

Added comprehensive tracking functions:
- `trackChatMessage()`: For chat message events
- `trackSaveCard()`: For card save events  
- `trackBookingLinkClick()`: For booking link click events
- `trackTripCreated()`: For trip creation events
- `trackTripAccessed()`: For trip access events
- `trackTripDetailsUpdated()`: For trip detail updates
- `trackReferralBonusEarned()`: For referral bonus events
- `trackMessageLimitReached()`: For message limit events
- `trackGetMoreMessagesModalOpened()`: For modal opening events
- `trackCurrencyChanged()`: For currency change events
- `trackError()`: For general error events
- `trackRateLimitHit()`: For rate limit events
- `trackApiError()`: For API error events

### Testing
A comprehensive test script was created at `scripts/test-posthog-tracking.ts` to verify all tracking functions work correctly.

## Data Flow

1. **User Action** → Component Event Handler
2. **Event Handler** → PostHog Tracking Function
3. **PostHog Function** → PostHog Dashboard

## Benefits

- **User Behavior Analysis**: Track how users interact with recommendations
- **Conversion Tracking**: Monitor booking link clicks vs saves
- **Message Engagement**: Understand chat usage patterns
- **Trip Planning Insights**: See which types of recommendations are most popular
- **Error Monitoring**: Track and analyze application errors
- **Performance Monitoring**: Monitor rate limits and API failures
- **User Journey Analysis**: Track complete user flows from signup to booking
- **Feature Usage**: Understand which features are most used
- **Retention Analysis**: Track user engagement over time

## Analytics Use Cases

### Funnel Analysis
1. **Signup → Trip Creation → Message Sent → Card Saved → Booking Click**
2. **Message Limit Reached → Modal Opened → Referral Used**

### Cohort Analysis
- Track user engagement by signup date
- Monitor message usage patterns
- Analyze trip completion rates

### Error Analysis
- Monitor API failure rates
- Track rate limit impacts
- Identify common error patterns

### Feature Adoption
- Currency preference analysis
- Trip management usage
- Referral system effectiveness

## Next Steps

1. Monitor PostHog dashboard for event data
2. Create funnels to analyze user journey
3. Set up alerts for unusual patterns
4. Use data to optimize recommendation algorithms
5. Implement A/B testing for feature improvements
6. Create custom dashboards for key metrics 