'use client'

import { useEffect, useState } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Return fallback on both server and client until mounted
  // This ensures server and client render the same thing initially
  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
} 