#!/usr/bin/env tsx

import { trackChatMessage, trackSaveCard, trackBookingLinkClick } from '../src/lib/posthog';

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

console.log('PostHog tracking tests completed!');
console.log('Check your PostHog dashboard to see the events.'); 