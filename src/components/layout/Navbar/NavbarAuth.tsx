'use client';

import { motion } from 'framer-motion';
import { Sparkles, User, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavbarAuthProps {
  user: any;
  onSignOut: () => void;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function NavbarAuth({ user, onSignOut, isMobile = false, onItemClick }: NavbarAuthProps) {
  if (isMobile) {
    return (
      <div className="pt-4 border-t border-gray-200 space-y-3">
        {user ? (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full text-left px-4 py-3 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <Link href="/trips" className="flex items-center space-x-3" onClick={onItemClick}>
                <User className="w-5 h-5" />
                <span>My Trips</span>
              </Link>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <Link href="/chat" className="flex items-center space-x-2" onClick={onItemClick}>
                <Sparkles className="w-5 h-5" />
                <span>New Trip</span>
              </Link>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              onClick={onSignOut}
              className="w-full text-left px-4 py-3 text-gray-900 hover:text-red-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 flex items-center space-x-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <Link href="/chat" className="flex items-center space-x-2" onClick={onItemClick}>
                <Sparkles className="w-5 h-5" />
                <span>Start Planning</span>
              </Link>
            </motion.button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-4">
      {user ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg px-3 py-2"
          >
            <Link href="/trips" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>My Trips</span>
            </Link>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <Link href="/chat" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>New Trip</span>
            </Link>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSignOut}
            className="text-gray-600 hover:text-red-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 rounded-lg px-3 py-2 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </motion.button>
        </>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <Link href="/chat" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Start Planning</span>
            </Link>
          </motion.button>
        </>
      )}
    </div>
  );
} 