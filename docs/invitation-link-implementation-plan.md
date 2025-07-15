# Invitation Link Implementation Plan - MVP

## Overview
This document outlines the missing implementation parts for the invitation link system to make it fully functional. The current system generates invitation links but doesn't activate them when users sign up.

## Current Status
- ✅ Invitation link generation in modal
- ✅ Referral tracking database table
- ✅ Backend logic for bonus distribution
- ❌ **Invitation link activation (missing)**
- ❌ **Referral code handling during signup (missing)**

## Missing Implementation Parts

### 1. Invitation Link Route (`/invite/[code]`)

**File to create:** `src/app/invite/[code]/page.tsx`

**Purpose:** When someone visits an invitation link, store the referral code and redirect to signup.

**Implementation:**
```typescript
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const referralCode = params.code as string;

  useEffect(() => {
    // Store referral code in localStorage
    localStorage.setItem('referralCode', referralCode);
    
    // Redirect to signup page
    router.push('/login');
  }, [referralCode, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your invitation...</p>
      </div>
    </div>
  );
}
```

### 2. Referral Code Handling During Signup

**File to modify:** `src/app/login/page.tsx` (or wherever signup happens)

**Purpose:** Check for referral code during signup and apply bonus when user successfully registers.

**Implementation steps:**
1. After successful signup, check if `referralCode` exists in localStorage
2. If exists, call the backend API to use the referral code
3. Clear the referral code from localStorage
4. Show success message about bonus messages

**Code to add after successful signup:**
```typescript
// After successful signup
const referralCode = localStorage.getItem('referralCode');
if (referralCode) {
  try {
    // Call backend to use referral code
    const response = await fetch('/api/referrals/use', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode })
    });
    
    if (response.ok) {
      // Show success message
      console.log('Referral bonus applied!');
    }
  } catch (error) {
    console.error('Error applying referral:', error);
  } finally {
    // Clear referral code
    localStorage.removeItem('referralCode');
  }
}
```

### 3. Backend API Route for Using Referral Codes

**File to create:** `src/app/api/referrals/use/route.ts`

**Purpose:** Handle referral code usage and grant bonus messages to both users.

**Implementation:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { MessageCounterService } from '@/lib/message-counter-service';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient(request);
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referralCode } = await request.json();
    
    if (!referralCode) {
      return NextResponse.json({ error: 'Referral code required' }, { status: 400 });
    }

    // Use the referral code
    await MessageCounterService.useReferral(referralCode, session.user.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error using referral code:', error);
    return NextResponse.json(
      { error: 'Invalid or already used referral code' },
      { status: 400 }
    );
  }
}
```

## Environment Variables Required

Add these to your `.env` file:
```bash
# Number of messages users get for each successful referral
MESSAGE_COUNTER_REFERRAL_BONUS=25
NEXT_PUBLIC_MESSAGE_COUNTER_REFERRAL_BONUS=25

# Initial message count for new users
MESSAGE_COUNTER_INITIAL_COUNT=50
```

## Database Schema (Already Implemented)

The following tables should already exist:
- `user_message_counters` - tracks user message counts
- `user_referrals` - tracks referral codes and usage

## Testing the Implementation

### Test Flow:
1. User A opens "Get More Messages" modal
2. User A copies invitation link (e.g., `https://yourapp.com/invite/ABC123`)
3. User A shares link with User B
4. User B visits the invitation link
5. User B gets redirected to signup page
6. User B completes signup
7. Both User A and User B receive bonus messages

### Manual Testing Steps:
1. Create a test user and deplete their messages
2. Open the "Get More Messages" modal
3. Copy the invitation link
4. Open the link in an incognito window
5. Complete signup process
6. Verify both users received bonus messages

## Error Handling

### Common Issues:
- **Invalid referral code**: Show user-friendly error message
- **Already used referral code**: Prevent duplicate usage
- **Network errors**: Graceful fallback, don't block signup
- **Missing referral code**: Continue with normal signup

### Error Messages:
- "This invitation link has already been used"
- "Invalid invitation link"
- "Unable to apply referral bonus, but signup successful"

## Security Considerations

### MVP Security (Simple):
- Referral codes are single-use only
- Codes expire after 30 days (optional)
- Only authenticated users can use referral codes
- Rate limiting on referral code usage

### Implementation Notes:
- Store referral codes in localStorage (simple for MVP)
- Validate referral codes on the server side
- Log referral usage for monitoring

## Success Metrics

Track these metrics to measure success:
- Number of invitation links generated
- Number of successful referrals
- Conversion rate from invitation link to signup
- Average messages earned per user through referrals

## Future Enhancements (Post-MVP)

1. **Email invitations**: Send invitation links via email
2. **Social sharing**: Direct sharing to social media platforms
3. **Referral dashboard**: Track referral history and earnings
4. **Tiered rewards**: Different bonuses for different referral milestones
5. **Analytics**: Detailed referral tracking and reporting

## Implementation Priority

### High Priority (MVP):
1. Create `/invite/[code]` route
2. Add referral code handling to signup flow
3. Create backend API for using referral codes

### Medium Priority:
1. Add success/error messages
2. Implement basic analytics tracking
3. Add referral code expiration

### Low Priority (Future):
1. Email invitations
2. Social sharing
3. Referral dashboard

## Notes for AI Implementation

- Keep the implementation simple and focused on core functionality
- Use existing patterns and components from the codebase
- Follow the established error handling patterns
- Test thoroughly with the existing message counter system
- Ensure the referral bonus amount is configurable via environment variables
- Maintain consistency with the existing UI/UX design

## Completion Checklist

- [x] Create `/invite/[code]` page
- [x] Add referral code storage in localStorage
- [x] Modify signup flow to handle referral codes
- [x] Create `/api/referrals/use` endpoint
- [x] Test complete referral flow
- [x] Add error handling and user feedback
- [x] Document the feature for users
- [x] Add toast notification system
- [x] Create comprehensive test script
- [x] Add validation script

✅ **COMPLETED** - The invitation link system is now fully functional and users can earn bonus messages through referrals! 