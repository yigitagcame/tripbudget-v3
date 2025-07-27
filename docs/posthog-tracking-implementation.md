# PostHog Event Tracking Implementation

## Overview
This document outlines the implementation of PostHog event tracking for three key user actions in the trip-budget application.

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

## PostHog Utility Functions

### Enhanced PostHog Library
Location: `src/lib/posthog.ts`

Added three new tracking functions:
- `trackChatMessage()`: For chat message events
- `trackSaveCard()`: For card save events  
- `trackBookingLinkClick()`: For booking link click events

### Testing
A test script was created at `scripts/test-posthog-tracking.ts` to verify the tracking functions work correctly.

## Data Flow

1. **User Action** → Component Event Handler
2. **Event Handler** → PostHog Tracking Function
3. **PostHog Function** → PostHog Dashboard

## Benefits

- **User Behavior Analysis**: Track how users interact with recommendations
- **Conversion Tracking**: Monitor booking link clicks vs saves
- **Message Engagement**: Understand chat usage patterns
- **Trip Planning Insights**: See which types of recommendations are most popular

## Next Steps

1. Monitor PostHog dashboard for event data
2. Create funnels to analyze user journey
3. Set up alerts for unusual patterns
4. Use data to optimize recommendation algorithms 