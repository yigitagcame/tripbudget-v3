'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCounterService } from '@/lib/message-counter-service';
import { trackGetMoreMessagesModalOpened } from '@/lib/posthog';

interface GetMoreMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMessageCount: number;
}

export default function GetMoreMessagesModal({ 
  isOpen, 
  onClose, 
  currentMessageCount 
}: GetMoreMessagesModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');
  const [loading, setLoading] = useState(false);

  // Get referral bonus from environment variable
  const referralBonus = parseInt(process.env.NEXT_PUBLIC_MESSAGE_COUNTER_REFERRAL_BONUS || '25');

  // Generate invitation link when modal opens
  React.useEffect(() => {
    if (isOpen && user) {
      // Track modal opening
      trackGetMoreMessagesModalOpened({
        user_id: user.id,
        current_message_count: currentMessageCount
      });
      generateInvitationLink();
    }
  }, [isOpen, user]);

  const generateInvitationLink = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Create a referral in the database
      const referral = await MessageCounterService.createReferral(user.id, 'friend@example.com'); // We'll use a placeholder email
      
      // Generate the invitation link
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      const link = `${baseUrl}/invite/${referral.referral_code}`;
      setInvitationLink(link);
    } catch (error) {
      console.error('Error generating invitation link:', error);
      // Fallback to generating a random code if database fails
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const link = `${baseUrl}/invite/${referralCode}`;
      setInvitationLink(link);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on TripBudget - AI Travel Planning',
          text: 'I found this amazing AI travel assistant! Get free messages when you sign up using my link:',
          url: invitationLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback to copying
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Get More Messages</h2>
                  <p className="text-sm text-gray-500">Share and earn free messages</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Current Status */}
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">
                    You have {currentMessageCount} messages left
                  </p>
                  <p className="text-xs text-red-600">
                    Share your invitation link to get more messages
                  </p>
                </div>
              </div>
            </div>

            {/* How it works */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">How it works:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Share your unique invitation link with friends
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">2</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    When they sign up using your link, you both get {referralBonus} bonus messages
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">3</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Continue planning amazing trips together!
                  </p>
                </div>
              </div>
            </div>

            {/* Invitation Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Invitation Link
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={loading ? 'Generating link...' : invitationLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
                <button
                  onClick={handleCopyLink}
                  disabled={loading || !invitationLink}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>

            {/* Bonus Info */}
            <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 text-center">
                💡 <strong>Bonus:</strong> You get {referralBonus} messages for each friend who signs up!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 