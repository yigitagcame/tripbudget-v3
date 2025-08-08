'use client';

import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store/AppStore';
import { StatePersistence, persistenceConfigs } from '@/lib/store/persistence';
import { User } from '@supabase/supabase-js';

// Enhanced state management hook
export function useAppState() {
  const store = useAppStore();

  // Load persisted state on mount
  useEffect(() => {
    // Load theme
    const savedTheme = StatePersistence.load(
      persistenceConfigs.theme.key,
      'light',
      persistenceConfigs.theme
    );
    if (savedTheme !== store.theme) {
      store.setTheme(savedTheme);
    }

    // Load UI state
    const savedUI = StatePersistence.load(
      persistenceConfigs.ui.key,
      { sidebarOpen: false },
      persistenceConfigs.ui
    );
    if (savedUI.sidebarOpen !== store.sidebarOpen) {
      store.setSidebarOpen(savedUI.sidebarOpen);
    }

    // Load message count
    const savedMessageCount = StatePersistence.load(
      persistenceConfigs.messageCount.key,
      0,
      persistenceConfigs.messageCount
    );
    if (savedMessageCount !== store.messageCount) {
      store.setMessageCount(savedMessageCount);
    }
  }, []);

  // Enhanced auth methods
  const setUser = useCallback((user: User | null) => {
    store.setUser(user);
    if (user) {
      StatePersistence.save(
        persistenceConfigs.user.key,
        { id: user.id, email: user.email },
        persistenceConfigs.user
      );
    } else {
      StatePersistence.remove(persistenceConfigs.user.key, persistenceConfigs.user);
    }
  }, [store]);

  const setLoading = useCallback((loading: boolean) => {
    store.setLoading(loading);
  }, [store]);

  // Enhanced UI methods
  const setTheme = useCallback((theme: 'light' | 'dark') => {
    store.setTheme(theme);
    StatePersistence.save(
      persistenceConfigs.theme.key,
      theme,
      persistenceConfigs.theme
    );
  }, [store]);

  const setSidebarOpen = useCallback((open: boolean) => {
    store.setSidebarOpen(open);
    StatePersistence.save(
      persistenceConfigs.ui.key,
      { sidebarOpen: open },
      persistenceConfigs.ui
    );
  }, [store]);

  const toggleSidebar = useCallback(() => {
    const newState = !store.sidebarOpen;
    store.toggleSidebar();
    StatePersistence.save(
      persistenceConfigs.ui.key,
      { sidebarOpen: newState },
      persistenceConfigs.ui
    );
  }, [store]);

  // Enhanced message methods
  const setMessageCount = useCallback((count: number) => {
    store.setMessageCount(count);
    StatePersistence.save(
      persistenceConfigs.messageCount.key,
      count,
      persistenceConfigs.messageCount
    );
  }, [store]);

  const decreaseMessageCount = useCallback((amount: number = 1) => {
    const newCount = Math.max(store.messageCount - amount, 0);
    store.decreaseMessageCount(amount);
    StatePersistence.save(
      persistenceConfigs.messageCount.key,
      newCount,
      persistenceConfigs.messageCount
    );
  }, [store]);

  // Clear all persisted state
  const clearPersistedState = useCallback(() => {
    StatePersistence.remove(persistenceConfigs.user.key, persistenceConfigs.user);
    StatePersistence.remove(persistenceConfigs.theme.key, persistenceConfigs.theme);
    StatePersistence.remove(persistenceConfigs.messageCount.key, persistenceConfigs.messageCount);
    StatePersistence.remove(persistenceConfigs.ui.key, persistenceConfigs.ui);
  }, []);

  return {
    // Auth state
    user: store.user,
    loading: store.loading,
    setUser,
    setLoading,

    // UI state
    theme: store.theme,
    sidebarOpen: store.sidebarOpen,
    setTheme,
    setSidebarOpen,
    toggleSidebar,

    // Message state
    messageCount: store.messageCount,
    setMessageCount,
    decreaseMessageCount,
    hasEnoughMessages: store.hasEnoughMessages,

    // Utility
    clearPersistedState,
  };
} 