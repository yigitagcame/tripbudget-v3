'use client';

import React from 'react';
import { useMessageCounter } from '@/contexts/MessageCounterContext';
import { MessageCircle, AlertCircle } from 'lucide-react';

interface MessageCounterProps {
  onGetMoreMessages?: () => void;
}

export default function MessageCounter({ onGetMoreMessages }: MessageCounterProps) {
  const { messageCount, loading, hasEnoughMessages } = useMessageCounter();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <MessageCircle className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!hasEnoughMessages()) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg">
        <AlertCircle className="w-4 h-4 text-red-600" />
        <span className="text-sm font-medium text-red-800">
          {messageCount} messages left
        </span>
        {onGetMoreMessages && (
          <button
            onClick={onGetMoreMessages}
            className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
          >
            Get More
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
      <MessageCircle className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-800">
        {messageCount} messages left
      </span>
    </div>
  );
} 