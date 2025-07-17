'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { identifyUser, resetUser, trackEvent } from '@/lib/posthog';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithProvider: (provider: 'google' | 'twitter') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthContext - Getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      console.log('AuthContext - Initial session:', !!session);
      console.log('AuthContext - Initial user:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext - Auth state change:', event);
        console.log('AuthContext - Session:', !!session);
        console.log('AuthContext - User:', session?.user?.email);
        
        // Track auth events with PostHog
        if (event === 'SIGNED_IN' && session?.user) {
          trackEvent('user_signed_in', {
            user_id: session.user.id,
            email: session.user.email,
            provider: session.user.app_metadata?.provider
          });
          identifyUser(session.user.id, {
            email: session.user.email,
            created_at: session.user.created_at
          });
        } else if (event === 'SIGNED_OUT') {
          trackEvent('user_signed_out');
          resetUser();
        }
        
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      trackEvent('sign_in_failed', {
        error_message: error.message,
        error_code: error.status
      });
    }
    
    return { user: data.user, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithProvider = async (provider: 'google' | 'twitter') => {
    trackEvent('oauth_initiated', { provider });
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
    
    if (error) {
      console.error('OAuth error:', error);
      trackEvent('oauth_failed', {
        provider,
        error_message: error.message,
        error_code: error.status
      });
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
    signInWithProvider,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 