'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { MessageCounterService } from '@/lib/api/chat/message-counter-service';

export interface MessageCounterContextType {
  messageCount: number;
  loading: boolean;
  refreshCounter: () => Promise<void>;
  decreaseCount: (amount?: number) => Promise<void>;
  decreaseLocalCount: (amount?: number) => void;
  hasEnoughMessages: (required?: number) => boolean;
}

const MessageCounterContext = createContext<MessageCounterContextType | undefined>(undefined);

export { MessageCounterContext };

export function MessageCounterProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messageCount, setMessageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCounter = async () => {
    if (!user) {
      setMessageCount(0);
      setLoading(false);
      return;
    }

    try {
      const counter = await MessageCounterService.getUserCounter(user.id);
      setMessageCount(counter.message_count);
    } catch (error) {
      console.error('Error loading message counter:', error);
      setMessageCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounter();
  }, [user]);

  const refreshCounter = async () => {
    await loadCounter();
  };

  const decreaseCount = async (amount: number = 1) => {
    if (!user) return;
    
    try {
      const counter = await MessageCounterService.decreaseMessageCount(user.id, amount);
      setMessageCount(counter.message_count);
    } catch (error) {
      console.error('Error decreasing message count:', error);
    }
  };

  const decreaseLocalCount = (amount: number = 1) => {
    // Only update the local state, no backend call
    setMessageCount(prev => Math.max(prev - amount, 0));
  };

  const hasEnoughMessages = (required: number = 1) => {
    return messageCount >= required;
  };

  const value = {
    messageCount,
    loading,
    refreshCounter,
    decreaseCount,
    decreaseLocalCount,
    hasEnoughMessages
  };

  return (
    <MessageCounterContext.Provider value={value}>
      {children}
    </MessageCounterContext.Provider>
  );
}

export function useMessageCounter() {
  const context = useContext(MessageCounterContext);
  if (context === undefined) {
    throw new Error('useMessageCounter must be used within a MessageCounterProvider');
  }
  return context;
} 