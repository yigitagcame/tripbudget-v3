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