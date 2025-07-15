'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to ensure auth context is properly initialized
    const timer = setTimeout(() => {
      if (!loading && !user) {
        console.log('ProtectedRoute - No user found, redirecting to login');
        router.push('/login');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  // Debug logging
  console.log('ProtectedRoute - Loading:', loading);
  console.log('ProtectedRoute - User:', user?.email);
  console.log('ProtectedRoute - User exists:', !!user);

  if (loading) {
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
            Loading...
          </h2>
          <p className="text-gray-600">
            Please wait while we verify your authentication
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, showing loading instead of null');
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
            <Plane className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Redirecting...
          </h2>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute - User authenticated, rendering children');
  return <>{children}</>;
} 