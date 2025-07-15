'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plane, Loader2 } from 'lucide-react';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const referralCode = params.code as string;

  useEffect(() => {
    // Store referral code in localStorage
    localStorage.setItem('referralCode', referralCode);
    
    // Redirect to login page
    router.push('/login');
  }, [referralCode, router]);

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
          Setting up your invitation...
        </h2>
        <p className="text-gray-600 mb-4">
          Please wait while we prepare your referral bonus
        </p>
        <div className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      </motion.div>
    </div>
  );
} 