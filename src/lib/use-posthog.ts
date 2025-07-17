'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackEvent, identifyUser, setUserProperties, resetUser } from './posthog'

export const usePostHog = () => {
  const pathname = usePathname()

  // Track page views automatically
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname)
    }
  }, [pathname])

  return {
    trackEvent,
    trackPageView,
    identifyUser,
    setUserProperties,
    resetUser
  }
} 