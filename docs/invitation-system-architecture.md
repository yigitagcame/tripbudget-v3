# Invitation System Architecture - Quick Reference

## System Overview
The invitation system allows users to earn bonus messages by referring friends. Currently, the UI and backend logic exist, but the link activation is missing.

## Current Architecture

### Frontend Components
```
src/components/chat/
├── GetMoreMessagesModal.tsx     # Modal with invitation link generation
├── MessageCounter.tsx           # Shows message count and "Get More" button
└── ChatWindow.tsx              # Main chat interface with out-of-messages warning
```

### Backend Services
```
src/lib/
├── message-counter-service.ts           # Client-side message counter logic
├── server/message-counter-service-server.ts  # Server-side message counter logic
└── supabase-server.ts                   # Database connection
```

### Database Tables
```sql
-- Tracks user message counts
user_message_counters (
  id, user_id, message_count, created_at, updated_at
)

-- Tracks referral codes and usage
user_referrals (
  id, referrer_id, referee_email, referral_code, is_used, used_at, created_at
)
```

## Key Functions

### Message Counter Service
- `getUserCounter(userId)` - Get or create user's message counter
- `decreaseMessageCount(userId, amount)` - Decrease messages when used
- `increaseMessageCount(userId, amount, reason)` - Increase messages (bonus)
- `createReferral(userId, refereeEmail)` - Create referral code
- `useReferral(referralCode, refereeUserId)` - Apply referral bonus

### Environment Variables
```bash
MESSAGE_COUNTER_REFERRAL_BONUS=25          # Server-side bonus amount
NEXT_PUBLIC_MESSAGE_COUNTER_REFERRAL_BONUS=25  # Client-side bonus amount
MESSAGE_COUNTER_INITIAL_COUNT=50           # Initial messages for new users
```

## Current Flow
1. User runs out of messages
2. User sees warning banner with "Get More Messages" button
3. User opens modal and gets invitation link
4. User shares link with friends
5. **MISSING**: Friend visits link and gets bonus
6. **MISSING**: Both users receive bonus messages

## Missing Implementation
1. `/invite/[code]` route to capture referral codes
2. Signup flow integration to apply referral codes
3. `/api/referrals/use` endpoint to process referrals

## Error Handling Patterns
- 402 status code for insufficient messages
- Structured error responses with user-friendly messages
- Graceful fallbacks for network errors

## UI Patterns
- Gradient backgrounds (blue to purple)
- Rounded corners (rounded-xl, rounded-2xl)
- Motion animations with framer-motion
- Consistent color scheme (blue-600, purple-600)

## Testing Approach
- Test message depletion and warning display
- Test invitation link generation
- Test referral code application
- Verify bonus message distribution

## Security Notes
- Referral codes are single-use
- Server-side validation required
- Authentication required for bonus application
- Rate limiting recommended

## Integration Points
- Auth system (Supabase)
- Message counter context
- Chat API error handling
- Database transactions for bonus distribution 