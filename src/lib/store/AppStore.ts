import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

// Store slices
export interface AuthSlice {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export interface UISlice {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export interface MessageSlice {
  messageCount: number;
  setMessageCount: (count: number) => void;
  decreaseMessageCount: (amount?: number) => void;
  hasEnoughMessages: (required?: number) => boolean;
}

// Combined store type
export interface AppStore extends AuthSlice, UISlice, MessageSlice {}

// Create the store
export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Auth slice
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      // UI slice
      theme: 'light',
      sidebarOpen: false,
      setTheme: (theme) => set({ theme }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // Message slice
      messageCount: 0,
      setMessageCount: (count) => set({ messageCount: count }),
      decreaseMessageCount: (amount = 1) => 
        set((state) => ({ 
          messageCount: Math.max(state.messageCount - amount, 0) 
        })),
      hasEnoughMessages: (required = 1) => get().messageCount >= required,
    }),
    {
      name: 'trip-budget-store',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        messageCount: state.messageCount,
      }),
    }
  )
);

// Selector hooks for better performance
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  loading: state.loading,
  setUser: state.setUser,
  setLoading: state.setLoading,
}));

export const useUI = () => useAppStore((state) => ({
  theme: state.theme,
  sidebarOpen: state.sidebarOpen,
  setTheme: state.setTheme,
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebar: state.toggleSidebar,
}));

export const useMessages = () => useAppStore((state) => ({
  messageCount: state.messageCount,
  setMessageCount: state.setMessageCount,
  decreaseMessageCount: state.decreaseMessageCount,
  hasEnoughMessages: state.hasEnoughMessages,
})); 