'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import NavbarMenu from './NavbarMenu';
import NavbarAuth from './NavbarAuth';

interface NavItem {
  name: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
  user: any;
  onSignOut: () => void;
}

export default function MobileMenu({ isOpen, setIsOpen, navItems, user, onSignOut }: MobileMenuProps) {
  const handleItemClick = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200"
          >
            <div className="px-4 py-6 space-y-4">
              <NavbarMenu 
                navItems={navItems} 
                isMobile={true} 
                onItemClick={handleItemClick}
              />
              
              {/* Mobile Auth Buttons */}
              <NavbarAuth 
                user={user} 
                onSignOut={onSignOut} 
                isMobile={true} 
                onItemClick={handleItemClick}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 