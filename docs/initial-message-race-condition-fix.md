# Initial Message Race Condition Fix

## Issue Description

When users entered a message on the landing page and clicked "Start Planning", the following behavior was observed:

1. ✅ **After refresh**: The question from the landing page appeared in the chat
2. ✅ **Answer visible**: The AI's response to the question was visible
3. ❌ **Immediate redirect**: The question from the landing page did NOT appear when redirected to the chat page right away

## Root Cause Analysis

The issue was caused by a **race condition** and **dependency management problem** in the chat page component:

### 1. Race Condition
- When redirected to `/chat?message=...`, the chat page loads and starts multiple async operations:
  - `loadTripAndHistory()` - loads trip data and chat history
  - `useEffect` for initial message processing - tries to send the message from URL
- These operations could complete in different orders, causing timing issues

### 2. Function Recreation Problem
- `handleSendMessage` was wrapped in `useCallback` with `[tripId, tripDetails]` dependencies
- When `tripDetails` changed during `loadTripAndHistory()`, `handleSendMessage` was recreated
- This recreation triggered the `useEffect` that depends on `handleSendMessage` to run again
- By the time the effect ran again, the initial message had already been processed or lost

### 3. State Management Issues
- The `useEffect` for initial message processing depended on `messages` state
- When messages changed, the effect would run again, potentially causing duplicate processing
- No mechanism to prevent multiple executions of the same initial message

## The Fix

### 1. Removed Unnecessary Dependencies
```typescript
// Before
const handleSendMessage = useCallback(async (message: string, currency?: string) => {
  // ... implementation
}, [tripId, tripDetails]); // ❌ tripDetails caused recreation

// After
const handleSendMessage = useCallback(async (message: string, currency?: string) => {
  // ... implementation
}, [tripId]); // ✅ Only tripId is needed
```

### 2. Added useRef for State Tracking
```typescript
// Before
const [initialMessageSent, setInitialMessageSent] = useState(false);

// After
const initialMessageProcessedRef = useRef(false);
```

**Why useRef instead of useState?**
- `useRef` doesn't trigger re-renders when changed
- `useRef` persists across re-renders without causing dependency changes
- Perfect for tracking one-time operations

### 3. Improved useEffect Logic
```typescript
// Before
useEffect(() => {
  if (initialMessage && !initialMessageSent && !loading && !chatHistoryLoading) {
    setInitialMessageSent(true);
    handleSendMessage(initialMessage);
    // ... cleanup
  }
}, [initialMessage, initialMessageSent, loading, chatHistoryLoading, handleSendMessage]);

// After
useEffect(() => {
  if (initialMessage && !initialMessageProcessedRef.current && !loading && !chatHistoryLoading) {
    initialMessageProcessedRef.current = true; // ✅ Immediate flag setting
    handleSendMessage(initialMessage);
    // ... cleanup
  }
}, [initialMessage, loading, chatHistoryLoading, handleSendMessage]); // ✅ Removed messages dependency
```

### 4. Immediate State Update
```typescript
// Mark as processed immediately to prevent race conditions
initialMessageProcessedRef.current = true;
```

This ensures that even if the effect runs multiple times, the message will only be processed once.

## Testing

Created comprehensive tests in `scripts/test-initial-message-fix.ts` that verify:

1. ✅ Initial message processing works correctly
2. ✅ Duplicate processing is prevented
3. ✅ URL parameter cleanup works
4. ✅ Loading states are handled properly
5. ✅ Empty messages are handled
6. ✅ Special characters are encoded correctly

## Results

After implementing the fix:

1. ✅ **Immediate redirect**: Question from landing page appears immediately when redirected
2. ✅ **No duplicates**: Message is processed exactly once
3. ✅ **Stable behavior**: No race conditions or timing issues
4. ✅ **Proper cleanup**: URL parameters are cleaned up correctly

## Key Learnings

1. **useRef for one-time operations**: Perfect for tracking state that shouldn't trigger re-renders
2. **Minimal dependencies**: Only include dependencies that are actually needed
3. **Immediate state updates**: Set flags immediately to prevent race conditions
4. **Race condition awareness**: Be careful with async operations and state updates

## Files Modified

- `src/app/chat/[tripId]/page.tsx` - Main fix implementation
- `scripts/test-initial-message-fix.ts` - Test validation script
- `docs/initial-message-race-condition-fix.md` - This documentation

## Related Components

- `src/components/landing/HeroSection.tsx` - Landing page with message input
- `src/app/chat/page.tsx` - Chat page router that handles initial redirect
- `src/components/chat/ChatWindow.tsx` - Chat interface component 