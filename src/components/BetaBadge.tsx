'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BetaBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function BetaBadge({ size = 'md', className = '' }: BetaBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full shadow-lg ${sizeClasses[size]} ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className={iconSizes[size]} />
      </motion.div>
      <span>BETA</span>
    </motion.div>
  );
} 