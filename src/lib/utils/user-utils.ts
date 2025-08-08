import { User } from '@supabase/supabase-js';
import { BrevoUserData } from '../api/user/brevo-user-service';

/**
 * Check if a user is a new user (first-time signup)
 * This uses a simple heuristic based on user creation time
 */
export function isNewUser(user: User): boolean {
  // Check if user was created in the last 5 minutes
  // This is a simple heuristic - in production you might want to use
  // a more sophisticated approach like checking user metadata or database records
  const userCreatedAt = new Date(user.created_at);
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  
  return userCreatedAt > fiveMinutesAgo;
}

/**
 * Extract user data from Supabase user for Brevo
 */
export function extractUserDataForBrevo(user: User, referralSource?: string): BrevoUserData {
  // Extract name from user metadata or user object
  let firstName: string | undefined;
  let lastName: string | undefined;
  
  // Try to get name from user metadata (OAuth providers)
  if (user.user_metadata) {
    firstName = user.user_metadata.full_name?.split(' ')[0] || 
                user.user_metadata.first_name || 
                user.user_metadata.name?.split(' ')[0];
    
    lastName = user.user_metadata.full_name?.split(' ').slice(1).join(' ') || 
               user.user_metadata.last_name || 
               user.user_metadata.name?.split(' ').slice(1).join(' ');
  }

  // Determine provider
  const provider = user.app_metadata?.provider || 'email';

  return {
    email: user.email!,
    firstName,
    lastName,
    userId: user.id,
    signupDate: user.created_at,
    provider,
    referralSource
  };
}

/**
 * Get referral source from localStorage (client-side only)
 */
export function getReferralSource(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  // Check for referral code in localStorage
  const referralCode = localStorage.getItem('referralCode');
  if (referralCode) {
    return `referral:${referralCode}`;
  }

  // Check for UTM parameters
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  if (utmSource || utmMedium || utmCampaign) {
    return `utm:${utmSource || 'unknown'}-${utmMedium || 'unknown'}-${utmCampaign || 'unknown'}`;
  }

  return undefined;
} 