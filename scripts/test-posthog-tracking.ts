#!/usr/bin/env tsx

import { 
  trackChatMessage, 
  trackSaveCard, 
  trackBookingLinkClick,
  trackTripCreated,
  trackTripAccessed,
  trackTripDetailsUpdated,
  trackReferralBonusEarned,
  trackMessageLimitReached,
  trackGetMoreMessagesModalOpened,
  trackCurrencyChanged,
  trackError,
  trackRateLimitHit,
  trackApiError
} from '../src/lib/posthog';

console.log('Testing PostHog tracking functions...');

// Test chat message tracking
console.log('Testing chat message tracking...');
trackChatMessage({
  trip_id: 'test-trip-123',
  message_length: 50,
  currency: 'EUR',
  user_id: 'test-user-456'
});

// Test save card tracking
console.log('Testing save card tracking...');
trackSaveCard('hotel', 'Test Hotel', {
  trip_id: 'test-trip-123',
  user_id: 'test-user-456',
  card_location: 'Paris, France',
  card_price: '€150/night',
  card_rating: 4.5
});

// Test booking link click tracking
console.log('Testing booking link click tracking...');
trackBookingLinkClick('flight', 'Test Flight', 'https://example.com/booking', {
  card_location: 'Paris, France',
  card_price: '€200',
  card_rating: 4.2
});

// Test trip management tracking
console.log('Testing trip management tracking...');
trackTripCreated('test-trip-123', {
  user_id: 'test-user-456'
});

trackTripAccessed('test-trip-123', {
  user_id: 'test-user-456',
  trip_origin: 'London',
  trip_destination: 'Paris'
});

trackTripDetailsUpdated('test-trip-123', ['destination', 'departure_date'], {
  user_id: 'test-user-456'
});

// Test message counter tracking
console.log('Testing message counter tracking...');
trackReferralBonusEarned('ABC123', 25, {
  user_id: 'test-user-456',
  user_email: 'test@example.com'
});

trackMessageLimitReached({
  user_id: 'test-user-456',
  trip_id: 'test-trip-123'
});

trackGetMoreMessagesModalOpened({
  user_id: 'test-user-456',
  current_message_count: 0
});

// Test currency tracking
console.log('Testing currency tracking...');
trackCurrencyChanged('EUR', 'USD', {
  trip_id: 'test-trip-123'
});

// Test error tracking
console.log('Testing error tracking...');
trackError('validation_error', 'Invalid input provided', {
  user_id: 'test-user-456'
});

trackRateLimitHit('/api/chat', {
  user_id: 'test-user-456'
});

trackApiError('flight_api', 'API timeout', {
  timestamp: new Date().toISOString()
});

console.log('PostHog tracking tests completed!');
console.log('Check your PostHog dashboard to see the events.'); 