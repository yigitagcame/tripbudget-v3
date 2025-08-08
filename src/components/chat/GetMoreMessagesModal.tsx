'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { useAppState } from '@/hooks/state/useAppState';
import { useToast } from '@/hooks/ui/useToast';

interface GetMoreMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  currentMessageCount: number;
  onMessageCountUpdated: (newCount: number) => void;
}

export default function GetMoreMessagesModal({
  isOpen,
  onClose,
  tripId,
  currentMessageCount,
  onMessageCountUpdated
}: GetMoreMessagesModalProps) {
  const { user } = useAppState();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');

  useEffect(() => {
    if (isOpen && user?.id) {
      generateInvitationLink();
    }
  }, [isOpen, user?.id, currentMessageCount]);

  const generateInvitationLink = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('/api/referrals/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          tripId: tripId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInvitationLink(data.invitationLink || '');
      }
    } catch (error) {
      console.error('Error generating invitation link:', error);
    }
  };

  const handleGetMoreMessages = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/users/message-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tripId: tripId,
          userId: user.id,
          count: 10, // Add 10 more messages
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onMessageCountUpdated(data.data);
          showSuccess('Message count updated successfully!');
          onClose();
        } else {
          showError(data.message || 'Failed to update message count');
        }
      } else {
        showError('Failed to update message count');
      }
    } catch (error) {
      console.error('Error updating message count:', error);
      showError('An error occurred while updating message count');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Get More Messages</h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            You've used {currentMessageCount} messages. Get more messages by:
          </p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Option 1: Invite Friends</h3>
              <p className="text-sm text-gray-600 mb-3">
                Share this invitation link with friends to get more messages:
              </p>
              {invitationLink && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={invitationLink}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(invitationLink)}
                  >
                    Copy
                  </Button>
                </div>
              )}
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Option 2: Direct Purchase</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get 10 more messages instantly:
              </p>
              <Button
                onClick={handleGetMoreMessages}
                loading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing...' : 'Get 10 More Messages'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
} 