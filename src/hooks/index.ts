// Auth hooks
export { useAuth } from './auth/useAuth';
export { useMessageCounter } from './auth/useMessageCounter';

// UI hooks
export { useToast } from './ui/useToast';
export { useModal } from './ui/useModal';
export { useLocalStorage } from './ui/useLocalStorage';
export { usePostHog } from './ui/use-posthog';

// State management hooks
export { useAppState } from './state/useAppState';
export { useAppStore, useAuth as useStoreAuth, useUI, useMessages } from '@/lib/store/AppStore'; 