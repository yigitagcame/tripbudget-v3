'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import Link from 'next/link';
import BetaBadge from '../../ui/BetaBadge';

interface NavbarLogoProps {
  showBetaBadge?: boolean;
}

export default function NavbarLogo({ showBetaBadge = true }: NavbarLogoProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="flex items-center space-x-2"
    >
      <Link 
        href="/" 
        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg p-1"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <Plane className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Trip Budget
        </span>
        {showBetaBadge && <BetaBadge size="sm" />}
      </Link>
    </motion.div>
  );
} 