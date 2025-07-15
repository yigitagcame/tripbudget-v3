'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Plane, Loader2, Twitter, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const providers = [
  {
    name: 'Google',
    id: 'google',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props} viewBox="0 0 24 24" fill="none"><g><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.625c-1.719-1.617-3.953-2.617-6.656-2.617-5.523 0-10 4.477-10 10s4.477 10 10 10c5.781 0 9.594-4.055 9.594-9.773 0-.656-.07-1.156-.156-1.477z" fill="#4285F4"/><path d="M3.545 7.548l3.289 2.414c.898-1.367 2.367-2.414 4.166-2.414 1.148 0 2.211.398 3.039 1.055l2.719-2.648c-1.484-1.367-3.398-2.203-5.758-2.203-3.516 0-6.484 2.367-7.547 5.555z" fill="#34A853"/><path d="M12 22c2.672 0 4.922-.883 6.563-2.406l-3.047-2.492c-.844.57-1.922.914-3.516.914-2.734 0-5.055-1.844-5.883-4.336l-3.242 2.5c1.547 3.125 4.844 5.32 8.125 5.32z" fill="#FBBC05"/><path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.484 3.648-5.617 3.648-3.375 0-6.125-2.789-6.125-6.148 0-3.359 2.75-6.148 6.125-6.148 1.922 0 3.211.82 3.953 1.523l2.703-2.625c-1.719-1.617-3.953-2.617-6.656-2.617-5.523 0-10 4.477-10 10s4.477 10 10 10c5.781 0 9.594-4.055 9.594-9.773 0-.656-.07-1.156-.156-1.477z" fill="#4285F4"/></g></svg>
    ),
  },
  {
    name: 'X.com',
    id: 'twitter',
    icon: (props: React.SVGProps<SVGSVGElement>) => <Twitter {...props} />,
  },
];

function LoginPageContent() {
  const { signInWithProvider } = useAuth();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'unexpected_error':
          setError('An unexpected error occurred. Please try again.');
          break;
        default:
          setError('An error occurred during sign in. Please try again.');
      }
    }
  }, [searchParams]);

  const handleSocialLogin = async (provider: 'google' | 'twitter') => {
    setLoadingProvider(provider);
    setError(null);
    await signInWithProvider(provider);
    // The user will be redirected by Supabase
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo and Title */}
          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6"
            >
              <Plane className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in to Trip Budget
            </h2>
            <p className="text-gray-600">
              Use your Google or X.com (Twitter) account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          {/* Social Login Buttons */}
          <div className="mt-8 space-y-4">
            {providers.map((provider) => (
              <motion.button
                key={provider.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSocialLogin(provider.id as 'google' | 'twitter')}
                disabled={!!loadingProvider}
                className={`w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg
                  ${provider.id === 'google' ? 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50' : 'bg-black text-white hover:bg-gray-900'}
                  ${loadingProvider && loadingProvider !== provider.id ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loadingProvider === provider.id ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  provider.icon({ className: 'w-6 h-6' })
                )}
                <span>
                  {loadingProvider === provider.id ? `Redirecting to ${provider.name}...` : `Continue with ${provider.name}`}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-center"
          >
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Plane className="w-8 h-8 text-white" />
            </div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
} 