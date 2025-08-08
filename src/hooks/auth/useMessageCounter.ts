'use client';

import { useContext } from 'react';
import { MessageCounterContext } from '@/contexts/MessageCounterContext';

export function useMessageCounter() {
  const context = useContext(MessageCounterContext);
  if (context === undefined) {
    throw new Error('useMessageCounter must be used within a MessageCounterProvider');
  }
  return context;
} 