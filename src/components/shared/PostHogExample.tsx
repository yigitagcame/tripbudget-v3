'use client'

import { usePostHog } from '@/hooks/ui/use-posthog'
import { Button } from '@/components/ui'

export default function PostHogExample() {
  const { trackEvent } = usePostHog()

  const handleCustomEvent = () => {
    trackEvent('custom_button_clicked', {
      button_name: 'example_button',
      timestamp: new Date().toISOString()
    })
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">PostHog Tracking Example</h3>
      <p className="text-sm text-gray-600 mb-4">
        This component demonstrates how to use PostHog tracking in your app.
      </p>
      <Button
        onClick={handleCustomEvent}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Track Custom Event
      </Button>
    </div>
  )
} 