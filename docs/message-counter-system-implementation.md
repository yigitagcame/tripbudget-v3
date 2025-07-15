# Message Counter System Implementation Plan

## Overview

This document outlines the implementation plan for a message counter system that tracks user message usage and provides mechanisms for users to earn additional messages through various actions.

## Core Requirements

1. **Message Counter**: Each user has a message counter stored in Supabase database
2. **Initial Allocation**: New users receive a default number of messages upon registration
3. **Usage Tracking**: Counter decreases with each AI message sent
4. **UI Display**: Counter is always visible on the chat page
5. **Earning Mechanisms**: Users can earn more messages through various actions
6. **Environment Configuration**: All earning mechanisms and amounts are configurable via environment variables

## Database Schema

### User Message Counter Table

```sql
CREATE TABLE user_message_counters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_message_counters ENABLE ROW LEVEL SECURITY;

-- Users can only access their own message counter
CREATE POLICY "Users can access their own message counter" ON user_message_counters
  FOR ALL USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_user_message_counters_user_id ON user_message_counters(user_id);
```

### Referral Tracking Table

```sql
CREATE TABLE user_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  referee_email VARCHAR(255) NOT NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- Users can only see referrals they created
CREATE POLICY "Users can see their own referrals" ON user_referrals
  FOR ALL USING (auth.uid() = referrer_id);

-- Add indexes
CREATE INDEX idx_user_referrals_referrer_id ON user_referrals(referrer_id);
CREATE INDEX idx_user_referrals_referral_code ON user_referrals(referral_code);
CREATE INDEX idx_user_referrals_referee_email ON user_referrals(referee_email);
```

## Environment Variables Configuration

Add the following environment variables to control the message counter system:

```env
# Message Counter System Configuration
MESSAGE_COUNTER_INITIAL_COUNT=50
MESSAGE_COUNTER_REFERRAL_BONUS=25
```

## Implementation Components

### 1. Message Counter Service

**File**: `src/lib/message-counter-service.ts`

```typescript
import { supabase } from './supabase';

export interface MessageCounter {
  id: string;
  user_id: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referee_email: string;
  referral_code: string;
  is_used: boolean;
  used_at: string | null;
  created_at: string;
}

export class MessageCounterService {
  // Get or create user message counter
  static async getUserCounter(userId: string): Promise<MessageCounter> {
    const { data, error } = await supabase
      .from('user_message_counters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // Counter doesn't exist, create it with initial count
      return this.createUserCounter(userId);
    }

    if (error) throw error;
    return data;
  }

  // Create new user counter with initial message count
  static async createUserCounter(userId: string): Promise<MessageCounter> {
    const initialCount = parseInt(process.env.MESSAGE_COUNTER_INITIAL_COUNT || '50');
    
    const { data, error } = await supabase
      .from('user_message_counters')
      .insert({
        user_id: userId,
        message_count: initialCount
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Decrease message count (when user sends message to AI)
  static async decreaseMessageCount(userId: string, amount: number = 1): Promise<MessageCounter> {
    const { data, error } = await supabase
      .from('user_message_counters')
      .update({
        message_count: supabase.raw(`GREATEST(message_count - ${amount}, 0)`),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Increase message count (when user earns messages)
  static async increaseMessageCount(userId: string, amount: number, reason: string): Promise<MessageCounter> {
    const { data, error } = await supabase
      .from('user_message_counters')
      .update({
        message_count: supabase.raw(`message_count + ${amount}`),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    
    // Log the earning action (optional)
    console.log(`User ${userId} earned ${amount} messages for: ${reason}`);
    
    return data;
  }

  // Check if user has enough messages
  static async hasEnoughMessages(userId: string, required: number = 1): Promise<boolean> {
    const counter = await this.getUserCounter(userId);
    return counter.message_count >= required;
  }

  // Generate referral code
  static async createReferral(userId: string, refereeEmail: string): Promise<Referral> {
    const referralCode = this.generateReferralCode();
    
    const { data, error } = await supabase
      .from('user_referrals')
      .insert({
        referrer_id: userId,
        referee_email: refereeEmail,
        referral_code: referralCode
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Use referral code
  static async useReferral(referralCode: string, refereeUserId: string): Promise<boolean> {
    const { data: referral, error: referralError } = await supabase
      .from('user_referrals')
      .select('*')
      .eq('referral_code', referralCode)
      .eq('is_used', false)
      .single();

    if (referralError || !referral) {
      throw new Error('Invalid or already used referral code');
    }

    // Mark referral as used
    const { error: updateError } = await supabase
      .from('user_referrals')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', referral.id);

    if (updateError) throw updateError;

    // Give bonus to both referrer and referee
    const referralBonus = parseInt(process.env.MESSAGE_COUNTER_REFERRAL_BONUS || '25');
    
    await this.increaseMessageCount(referral.referrer_id, referralBonus, 'referral_sent');
    await this.increaseMessageCount(refereeUserId, referralBonus, 'referral_used');

    return true;
  }

  // Generate unique referral code
  private static generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
```

### 2. Server-Side Message Counter Service

**File**: `src/lib/server/message-counter-service-server.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export class MessageCounterServiceServer {
  // Server-side version that bypasses RLS
  static async getUserCounter(userId: string) {
    const { data, error } = await supabase
      .from('user_message_counters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      return this.createUserCounter(userId);
    }

    if (error) throw error;
    return data;
  }

  static async createUserCounter(userId: string) {
    const initialCount = parseInt(process.env.MESSAGE_COUNTER_INITIAL_COUNT || '50');
    
    const { data, error } = await supabase
      .from('user_message_counters')
      .insert({
        user_id: userId,
        message_count: initialCount
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async decreaseMessageCount(userId: string, amount: number = 1) {
    const { data, error } = await supabase
      .from('user_message_counters')
      .update({
        message_count: supabase.raw(`GREATEST(message_count - ${amount}, 0)`),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async hasEnoughMessages(userId: string, required: number = 1): Promise<boolean> {
    const counter = await this.getUserCounter(userId);
    return counter.message_count >= required;
  }
}
```

### 3. Message Counter Context

**File**: `src/contexts/MessageCounterContext.tsx`

```typescript
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { MessageCounterService, type MessageCounter } from '@/lib/message-counter-service';

interface MessageCounterContextType {
  messageCount: number;
  loading: boolean;
  refreshCounter: () => Promise<void>;
  decreaseCount: (amount?: number) => Promise<void>;
  increaseCount: (amount: number, reason: string) => Promise<void>;
  hasEnoughMessages: (required?: number) => boolean;
}

const MessageCounterContext = createContext<MessageCounterContextType | undefined>(undefined);

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

  const increaseCount = async (amount: number, reason: string) => {
    if (!user) return;
    
    try {
      const counter = await MessageCounterService.increaseMessageCount(user.id, amount, reason);
      setMessageCount(counter.message_count);
    } catch (error) {
      console.error('Error increasing message count:', error);
    }
  };

  const hasEnoughMessages = (required: number = 1) => {
    return messageCount >= required;
  };

  const value = {
    messageCount,
    loading,
    refreshCounter,
    decreaseCount,
    increaseCount,
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
```

### 4. Message Counter Component

**File**: `src/components/chat/MessageCounter.tsx`

```typescript
'use client';

import React from 'react';
import { useMessageCounter } from '@/contexts/MessageCounterContext';
import { MessageCircle, Plus, Gift } from 'lucide-react';

export default function MessageCounter() {
  const { messageCount, loading } = useMessageCounter();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <MessageCircle className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
      <MessageCircle className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium text-blue-800">
        {messageCount} messages left
      </span>
      <button className="ml-2 p-1 text-blue-600 hover:text-blue-800 transition-colors">
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
```

### 5. Update Chat API Route

**File**: `src/app/api/chat/route.ts`

Add message counter validation and decrement logic:

```typescript
// Add import at the top
import { MessageCounterServiceServer } from '@/lib/server/message-counter-service-server';

// In the POST function, add before processing the message:
export async function POST(request: NextRequest) {
  // ... existing authentication code ...

  // Check if user has enough messages
  const hasEnoughMessages = await MessageCounterServiceServer.hasEnoughMessages(session.user.id);
  
  if (!hasEnoughMessages) {
    return NextResponse.json(
      { 
        error: 'Insufficient messages',
        message: 'You have run out of messages. Please earn more messages to continue chatting.',
        messageCount: 0
      },
      { status: 402 }
    );
  }

  // ... existing message processing code ...

  // After successful AI response, decrease message count
  try {
    await MessageCounterServiceServer.decreaseMessageCount(session.user.id);
  } catch (error) {
    console.error('Error decreasing message count:', error);
    // Don't fail the request if counter update fails
  }

  // ... rest of existing code ...
}
```

### 6. Update Chat Page

**File**: `src/app/chat/[tripId]/page.tsx`

Add message counter to the chat interface:

```typescript
// Add import
import MessageCounter from '@/components/chat/MessageCounter';

// In the component, add MessageCounter to the UI:
export default function ChatPage() {
  // ... existing code ...

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Left sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <MessageCounter />
          </div>
          <TripDetailsSidebar
            tripDetails={tripDetails}
            onTripDetailsChange={handleTripDetailsChange}
            currency={currency}
            onCurrencyChange={setCurrency}
          />
        </div>
        
        {/* ... rest of existing UI ... */}
      </div>
    </ProtectedRoute>
  );
}
```

### 7. Update App Layout

**File**: `src/app/layout.tsx`

Add MessageCounterProvider to the app:

```typescript
// Add import
import { MessageCounterProvider } from '@/contexts/MessageCounterContext';

// Wrap the app with MessageCounterProvider:
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MessageCounterProvider>
            {children}
          </MessageCounterProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

## Migration Files

### 1. Create Message Counter Tables

**File**: `migrations/20241222_000000_create_message_counter_tables.sql`

```sql
-- Create user message counters table
CREATE TABLE user_message_counters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_message_counters ENABLE ROW LEVEL SECURITY;

-- Users can only access their own message counter
CREATE POLICY "Users can access their own message counter" ON user_message_counters
  FOR ALL USING (auth.uid() = user_id);

-- Add index for performance
CREATE INDEX idx_user_message_counters_user_id ON user_message_counters(user_id);

-- Create user referrals table
CREATE TABLE user_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES auth.users(id) NOT NULL,
  referee_email VARCHAR(255) NOT NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_referrals ENABLE ROW LEVEL SECURITY;

-- Users can only see referrals they created
CREATE POLICY "Users can see their own referrals" ON user_referrals
  FOR ALL USING (auth.uid() = referrer_id);

-- Add indexes
CREATE INDEX idx_user_referrals_referrer_id ON user_referrals(referrer_id);
CREATE INDEX idx_user_referrals_referral_code ON user_referrals(referral_code);
CREATE INDEX idx_user_referrals_referee_email ON user_referrals(referee_email);
```

## Earning Mechanisms

The system currently supports the following earning mechanism:

### Referral System

Users can earn additional messages by referring friends:

1. **Generate Referral Code**: Users can create a unique referral code
2. **Share Referral Link**: Share the code with friends via email or other channels
3. **Bonus Distribution**: Both the referrer and referee receive bonus messages when the code is used
4. **One-Time Use**: Each referral code can only be used once

### Future Extensibility

The system is designed to be easily extensible. Future earning mechanisms can be added by:

1. **Adding new environment variables** for bonus amounts
2. **Creating new API endpoints** for specific actions
3. **Updating the MessageCounterService** with new earning methods
4. **Adding UI components** for the new earning mechanisms

### Example Future Mechanisms:

- **Purchasing**: `MESSAGE_COUNTER_PURCHASE_BONUS=100`
- **Daily Login Bonus**: `MESSAGE_COUNTER_DAILY_LOGIN_BONUS=5`
- **Weekly Active Bonus**: `MESSAGE_COUNTER_WEEKLY_ACTIVE_BONUS=15`
- **Social Share Bonus**: `MESSAGE_COUNTER_SOCIAL_SHARE_BONUS=10`
- **Feedback Bonus**: `MESSAGE_COUNTER_FEEDBACK_BONUS=20`
- **Complete Profile Bonus**: `MESSAGE_COUNTER_COMPLETE_PROFILE_BONUS=15`

## Testing

Create test scripts to verify the implementation:

**File**: `scripts/test-message-counter.ts`

```typescript
import { MessageCounterService } from '../src/lib/message-counter-service';

async function testMessageCounter() {
  console.log('🧪 Testing Message Counter System...\n');
  
  // Test environment variables
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'MESSAGE_COUNTER_INITIAL_COUNT',
    'MESSAGE_COUNTER_REFERRAL_BONUS'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.log('❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }
  
  console.log('✅ Environment variables configured');
  console.log(`   Initial count: ${process.env.MESSAGE_COUNTER_INITIAL_COUNT}`);
  console.log(`   Referral bonus: ${process.env.MESSAGE_COUNTER_REFERRAL_BONUS}`);
  
  // Add more tests as needed
  
  console.log('\n✅ Message counter system ready for implementation!');
  return true;
}

testMessageCounter().catch(console.error);
```

## Implementation Steps

1. **Database Setup**: Run the migration file to create the required tables
2. **Environment Variables**: Add the message counter configuration to your environment
3. **Core Services**: Implement the MessageCounterService and server-side version
4. **Context Provider**: Add the MessageCounterContext to manage state
5. **UI Components**: Create the MessageCounter component and integrate into chat page
6. **API Integration**: Update the chat API to check and decrement message counts
7. **Testing**: Run the test script to verify the implementation
8. **Referral System**: Implement the referral functionality (optional for MVP)

## Security Considerations

- **Row Level Security**: All tables have RLS enabled to ensure users can only access their own data
- **Server-Side Validation**: Message count checks happen server-side in API routes
- **Environment Configuration**: All bonus amounts are configurable and not hardcoded
- **Audit Trail**: Referral usage is tracked for potential abuse prevention

This implementation provides a solid foundation for the message counter system while maintaining flexibility for future enhancements. 