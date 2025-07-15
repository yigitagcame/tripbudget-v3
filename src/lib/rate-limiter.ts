/**
 * Simple in-memory rate limiter for API endpoints
 * Note: For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: any) => string; // Function to generate unique keys
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  public config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if a request is allowed
   */
  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.store.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
      this.store.delete(key);
    }

    if (!entry) {
      // First request in this window
      const resetTime = now + this.config.windowMs;
      this.store.set(key, { count: 1, resetTime });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime
      };
    }

    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    // Increment count
    entry.count++;
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.store.delete(key);
  }

  /**
   * Get current rate limit status
   */
  getStatus(key: string): { count: number; remaining: number; resetTime: number } | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      this.store.delete(key);
      return null;
    }

    return {
      count: entry.count,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Default rate limiter instances
export const chatRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100, // 100 requests per 15 minutes
  keyGenerator: (request: any) => {
    // Use IP address as key, fallback to user agent
    return request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown';
  }
});

export const flightSearchRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50, // 50 flight searches per 15 minutes
  keyGenerator: (request: any) => {
    return request.headers.get('x-forwarded-for') || 
           request.headers.get('x-real-ip') || 
           'unknown';
  }
});

/**
 * Middleware function to check rate limits
 */
export function checkRateLimit(
  request: any, 
  limiter: RateLimiter = chatRateLimiter
): { allowed: boolean; remaining: number; resetTime: number; headers: Record<string, string> } {
  const key = limiter.config.keyGenerator?.(request) || 'default';
  const result = limiter.isAllowed(key);
  
  const headers = {
    'X-RateLimit-Limit': limiter.config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
    'X-RateLimit-Reset-Time': new Date(result.resetTime).toISOString()
  };

  return {
    ...result,
    headers
  };
}

/**
 * Express-style middleware for Next.js API routes
 */
export function rateLimitMiddleware(
  limiter: RateLimiter = chatRateLimiter
) {
  return function(request: any, response: any, next?: () => void) {
    const rateLimitResult = checkRateLimit(request, limiter);
    
    // Add rate limit headers
    Object.entries(rateLimitResult.headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    if (!rateLimitResult.allowed) {
      return response.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      });
    }

    if (next) {
      next();
    }
  };
}

// Cleanup expired entries every 5 minutes
setInterval(() => {
  chatRateLimiter.cleanup();
  flightSearchRateLimiter.cleanup();
}, 5 * 60 * 1000);

export { RateLimiter, type RateLimitConfig, type RateLimitEntry }; 