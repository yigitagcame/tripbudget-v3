'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MessageCircle, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleStartPlanning = () => {
    if (message.trim()) {
      // Navigate to chat page with the message as a URL parameter
      router.push(`/chat?message=${encodeURIComponent(message.trim())}`);
    } else {
      // If no message, just go to chat page
      router.push('/chat');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleStartPlanning();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-20"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Travel Planning</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Plan Your Trip in{' '}
            <span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Minutes, Not Hours
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Stop juggling 10+ websites, endless research, and scattered notes. Get a complete itinerary with up-to-date flights and hotels just by chatting.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <Link href="/chat" className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
              Start Planning for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* AI Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Plan Your Trip with Natural Conversation
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="I want to plan a 5-day trip to Paris. I love art and food."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={handleStartPlanning}
              >
                Start Planning
              </button>
            </div>
          </div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="font-medium">Natural AI Conversation</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium">Automatic Budget Tracking</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium">Everything in One Place</span>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Free to start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Cancel anytime</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-gray-400 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
} 