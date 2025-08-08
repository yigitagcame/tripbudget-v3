'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAppState } from '@/hooks/state/useAppState';
import { AuthProvider } from './AuthContext';
import { MessageCounterProvider } from './MessageCounterContext';
import { ToastProvider } from './ToastContext';

// State provider context
interface StateProviderContextType {
  isInitialized: boolean;
}

const StateProviderContext = createContext<StateProviderContextType>({
  isInitialized: false,
});

export function StateProvider({ children }: { children: React.ReactNode }) {
  const appState = useAppState();
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Initialize state on mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Sync Zustand store with existing contexts for backward compatibility
  useEffect(() => {
    if (!isInitialized) return;

    // Here we could sync the Zustand store with existing contexts
    // This allows for gradual migration from contexts to the store
  }, [isInitialized]);

  return (
    <StateProviderContext.Provider value={{ isInitialized }}>
      <AuthProvider>
        <MessageCounterProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </MessageCounterProvider>
      </AuthProvider>
    </StateProviderContext.Provider>
  );
}

export function useStateProvider() {
  const context = useContext(StateProviderContext);
  if (context === undefined) {
    throw new Error('useStateProvider must be used within a StateProvider');
  }
  return context;
} 