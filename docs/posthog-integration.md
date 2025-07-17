# PostHog Integration Documentation

## Overview

This document describes the PostHog analytics integration for the Trip Budget application. PostHog is used to track user interactions, events, and behavior to improve the product experience.

## Setup

### Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_project_api_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com  # or your self-hosted instance
```

### Files Created/Modified

1. **`instrumentation-client.ts`** - PostHog initialization for Next.js 15.3+
2. **`instrumentation.ts`** - Instrumentation hook registration
3. **`next.config.ts`** - Enabled client instrumentation hook
4. **`src/lib/posthog.ts`** - PostHog utility functions
5. **`src/lib/use-posthog.ts`** - React hook for PostHog
6. **`src/contexts/AuthContext.tsx`** - Added auth event tracking
7. **`src/app/api/chat/route.ts`** - Added chat API tracking
8. **`src/components/landing/HeroSection.tsx`** - Added user interaction tracking

## Usage

### Basic Event Tracking

```typescript
import { trackEvent } from '@/lib/posthog'

// Track a simple event
trackEvent('button_clicked', {
  button_name: 'start_planning',
  page: 'home'
})
```

### Using the React Hook

```typescript
import { usePostHog } from '@/lib/use-posthog'

function MyComponent() {
  const { trackEvent, trackPageView } = usePostHog()

  const handleClick = () => {
    trackEvent('custom_event', {
      property: 'value'
    })
  }

  return <button onClick={handleClick}>Click me</button>
}
```

### User Identification

```typescript
import { identifyUser, setUserProperties } from '@/lib/posthog'

// Identify a user
identifyUser('user_123', {
  email: 'user@example.com',
  plan: 'premium'
})

// Set user properties
setUserProperties({
  subscription_status: 'active',
  last_login: new Date().toISOString()
})
```

## Tracked Events

### Authentication Events
- `user_signed_in` - When a user successfully signs in
- `user_signed_out` - When a user signs out
- `sign_in_failed` - When sign-in fails
- `oauth_initiated` - When OAuth sign-in is initiated
- `oauth_failed` - When OAuth sign-in fails

### Chat Events
- `chat_api_called` - When chat API is called
- `chat_response_successful` - When chat response is successful
- `chat_api_error` - When chat API encounters an error

### User Interaction Events
- `start_planning_clicked` - When user clicks start planning
- `cta_button_clicked` - When user clicks CTA buttons
- `page_view` - Automatic page view tracking

### Custom Events
You can track any custom events using the `trackEvent` function:

```typescript
trackEvent('flight_search_performed', {
  origin: 'NYC',
  destination: 'LAX',
  passengers: 2,
  currency: 'USD'
})
```

## Automatic Tracking

The following events are tracked automatically:

1. **Page Views** - All page navigation is automatically tracked
2. **Authentication** - Sign in/out events are tracked via AuthContext
3. **Chat Interactions** - API calls and responses are tracked

## Best Practices

1. **Event Naming**: Use snake_case for event names (e.g., `user_signed_in`)
2. **Properties**: Include relevant context in event properties
3. **User Identification**: Always identify users when they sign in
4. **Error Tracking**: Track errors with meaningful context
5. **Performance**: Don't track sensitive information

## Testing

You can test the integration by:

1. Opening your app in the browser
2. Checking the PostHog dashboard for incoming events
3. Using the PostHog debugger to see events in real-time
4. Running the example component: `src/components/PostHogExample.tsx`

## Troubleshooting

### Events Not Appearing
1. Check environment variables are set correctly
2. Verify PostHog key is valid
3. Check browser console for errors
4. Ensure instrumentation is enabled in `next.config.ts`

### Performance Issues
1. PostHog is loaded asynchronously and shouldn't block page load
2. Events are batched and sent efficiently
3. Use the hook for automatic page view tracking

## Example Implementation

See `src/components/PostHogExample.tsx` for a complete example of how to use PostHog tracking in a React component. 