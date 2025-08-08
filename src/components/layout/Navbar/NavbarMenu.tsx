'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
}

interface NavbarMenuProps {
  navItems: NavItem[];
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function NavbarMenu({ navItems, isMobile = false, onItemClick }: NavbarMenuProps) {
  if (isMobile) {
    return (
      <div className="px-4 py-6 space-y-4">
        {navItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={item.href}
              onClick={onItemClick}
              className="flex items-center space-x-3 px-4 py-3 text-gray-900 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              aria-label={`Navigate to ${item.name}`}
            >
              <span>{item.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => (
        <motion.div
          key={item.name}
          whileHover={{ y: -2 }}
          className="relative"
        >
          <Link
            href={item.href}
            className="text-gray-900 hover:text-blue-600 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg px-2 py-1"
            aria-label={`Navigate to ${item.name}`}
          >
            <span>{item.name}</span>
          </Link>
        </motion.div>
      ))}
    </nav>
  );
} 