import posthog from 'posthog-js'

// Initialize PostHog only in browser environment
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: '2025-05-24'
  })
}

// Export PostHog instance for direct access
export { posthog }

// Utility functions for common tracking events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  posthog.capture(eventName, properties)
}

// Page view tracking
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  posthog.capture('$pageview', {
    page_name: pageName,
    ...properties
  })
}

// User identification
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  posthog.identify(userId, properties)
}

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  posthog.people.set(properties)
}

// Reset user (for logout)
export const resetUser = () => {
  posthog.reset()
}

// Chat message tracking
export const trackChatMessage = (properties?: Record<string, any>) => {
  posthog.capture('chat_message_sent', {
    timestamp: new Date().toISOString(),
    ...properties
  })
}

// Save card action tracking
export const trackSaveCard = (cardType: string, cardTitle: string, properties?: Record<string, any>) => {
  posthog.capture('card_saved', {
    card_type: cardType,
    card_title: cardTitle,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

// Booking link click tracking
export const trackBookingLinkClick = (cardType: string, cardTitle: string, bookingUrl: string, properties?: Record<string, any>) => {
  posthog.capture('booking_link_clicked', {
    card_type: cardType,
    card_title: cardTitle,
    booking_url: bookingUrl,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

// Trip management tracking
export const trackTripCreated = (tripId: string, properties?: Record<string, any>) => {
  posthog.capture('trip_created', {
    trip_id: tripId,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

export const trackTripDetailsUpdated = (tripId: string, updatedFields: string[], properties?: Record<string, any>) => {
  posthog.capture('trip_details_updated', {
    trip_id: tripId,
    updated_fields: updatedFields,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

export const trackTripAccessed = (tripId: string, properties?: Record<string, any>) => {
  posthog.capture('trip_accessed', {
    trip_id: tripId,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

// Message counter tracking
export const trackReferralBonusEarned = (referralCode: string, bonusAmount: number, properties?: Record<string, any>) => {
  posthog.capture('referral_bonus_earned', {
    referral_code: referralCode,
    bonus_amount: bonusAmount,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

export const trackMessageLimitReached = (properties?: Record<string, any>) => {
  posthog.capture('message_limit_reached', {
    timestamp: new Date().toISOString(),
    ...properties
  })
}

export const trackGetMoreMessagesModalOpened = (properties?: Record<string, any>) => {
  posthog.capture('get_more_messages_modal_opened', {
    timestamp: new Date().toISOString(),
    ...properties
  })
}

// Currency and preferences tracking
export const trackCurrencyChanged = (fromCurrency: string, toCurrency: string, properties?: Record<string, any>) => {
  posthog.capture('currency_changed', {
    from_currency: fromCurrency,
    to_currency: toCurrency,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

// Error tracking
export const trackError = (errorType: string, errorMessage: string, properties?: Record<string, any>) => {
  posthog.capture('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

export const trackRateLimitHit = (endpoint: string, properties?: Record<string, any>) => {
  posthog.capture('rate_limit_hit', {
    endpoint: endpoint,
    timestamp: new Date().toISOString(),
    ...properties
  })
}

export const trackApiError = (apiName: string, errorMessage: string, properties?: Record<string, any>) => {
  posthog.capture('api_error', {
    api_name: apiName,
    error_message: errorMessage,
    timestamp: new Date().toISOString(),
    ...properties
  })
} 