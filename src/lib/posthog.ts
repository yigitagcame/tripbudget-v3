import posthog from 'posthog-js'

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