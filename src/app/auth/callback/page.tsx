'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plane, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { isNewUser, extractUserDataForBrevo, getReferralSource } from '@/lib/user-utils';
import { trackReferralBonusEarned } from '@/lib/posthog';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login?error=auth_callback_failed');
          return;
        }

        if (session) {
          // Check for referral code and apply it if exists
          const referralCode = localStorage.getItem('referralCode');
          if (referralCode) {
            try {
              // Call backend to use referral code
              const response = await fetch('/api/referrals/use', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralCode })
              });
              
              if (response.ok) {
                console.log('Referral bonus applied successfully!');
                showSuccess('Referral bonus applied! You received extra messages.');
                
                // Track referral bonus earned
                trackReferralBonusEarned(referralCode, 25, {
                  user_id: session.user.id,
                  user_email: session.user.email
                });
              } else {
                const errorData = await response.json();
                console.error('Error applying referral:', errorData.error);
                showError('Unable to apply referral bonus, but signup successful');
              }
            } catch (error) {
              console.error('Error applying referral:', error);
              // Don't block the flow, just log the error
            } finally {
              // Clear referral code regardless of success/failure
              localStorage.removeItem('referralCode');
            }
          }

          // Add new user to Brevo list if this is a new user
          if (isNewUser(session.user)) {
            try {
              console.log('Adding new user to Brevo list:', session.user.email);
              
              const referralSource = getReferralSource();
              const userData = extractUserDataForBrevo(session.user, referralSource);
              
              const response = await fetch('/api/brevo/add-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
              });
              
              if (response.ok) {
                console.log('User successfully added to Brevo list');
              } else {
                console.error('Failed to add user to Brevo list:', response.status);
                // Don't block the flow, just log the error
              }
            } catch (error) {
              console.error('Error adding user to Brevo list:', error);
              // Don't block the flow, just log the error
            }
          }

          // Successful authentication, redirect to chat
          router.push('/chat');
        } else {
          // No session found, redirect to login
          router.push('/login');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        router.push('/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6"
        >
          <Plane className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Sign In...
        </h2>
        <p className="text-gray-600 mb-4">
          Please wait while we verify your authentication
        </p>
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </motion.div>
    </div>
  );
} 