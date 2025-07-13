# Trip Storage Implementation Plan

## Overview

This document outlines the implementation plan for storing trip data in Supabase with unique trip IDs. Each chat session will have a unique trip ID that is set with the first message and can be accessed via URL routing.

## Core Requirements

1. **Unique Trip ID**: Each chat must have a unique trip ID set with the first message
2. **Database Storage**: Store trip data in Supabase with the following fields:
   - `trip_id` (required, unique)
   - `user_id` (required)
   - `origin` (optional, filled by AI)
   - `destination` (optional, filled by AI)
   - `departure_date` (optional, filled by AI)
   - `return_date` (optional, filled by AI)
   - `passenger_count` (optional, filled by AI)
3. **URL Routing**: Trip IDs must be URL-safe and accessible via `/chat/{trip_id}`
4. **User Access Control**: Users can only view/edit their own trips
5. **Migration Management**: Use timestamped migration files

## Database Schema

### Table Structure

```sql
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  origin VARCHAR(255),
  destination VARCHAR(255), 
  departure_date DATE,
  return_date DATE,
  passenger_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Security Policies

```sql
-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can only access their own trips
CREATE POLICY "Users can only access their own trips" ON trips
  FOR ALL USING (auth.uid() = user_id);
```

### Indexes

```sql
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_trip_id ON trips(trip_id);
```

## File Structure

```
migrations/
├── 20241220_143000_create_trips_table.sql
└── 20241220_143100_add_trips_indexes.sql

src/
├── lib/
│   ├── trip-utils.ts          # Trip ID generation
│   └── trip-service.ts        # Database operations
├── app/
│   ├── chat/
│   │   └── [tripId]/
│   │       └── page.tsx       # Dynamic chat route
│   └── api/
│       └── chat/
│           └── route.ts       # Modified chat API
└── contexts/
    └── AuthContext.tsx        # Existing auth context


```

## Implementation Details

### 1. Trip ID Generation

**File**: `src/lib/trip-utils.ts`

```typescript
export function generateTripId(): string {
  // Generate random string: 8 chars, URL-safe
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
```

**Purpose**: Creates URL-safe, 8-character random strings for trip IDs.

### 2. Trip Service

**File**: `src/lib/trip-service.ts`

```typescript
import { supabase } from './supabase';
import { generateTripId } from './trip-utils';

export const tripService = {
  // Create trip on first message
  async createTrip(userId: string): Promise<string | null> {
    const tripId = generateTripId();
    
    const { error } = await supabase
      .from('trips')
      .insert({ 
        trip_id: tripId,
        user_id: userId 
      });

    return error ? null : tripId;
  },

  // Update trip details from AI
  async updateTrip(tripId: string, updates: any): Promise<boolean> {
    const { error } = await supabase
      .from('trips')
      .update(updates)
      .eq('trip_id', tripId);

    return !error;
  },

  // Get trip by ID
  async getTrip(tripId: string) {
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('trip_id', tripId)
      .single();
    
    return data;
  },

  // Get user's trips
  async getUserTrips(userId: string) {
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return data || [];
  }
};
```

**Purpose**: Handles all database operations for trips.

### 3. Dynamic Chat Route

**File**: `src/app/chat/[tripId]/page.tsx`

```typescript
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { tripService } from '@/lib/trip-service';
import { useAuth } from '@/contexts/AuthContext';

export default function ChatPage() {
  const params = useParams();
  const tripId = params.tripId as string;
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId && user) {
      loadTrip();
    }
  }, [tripId, user]);

  const loadTrip = async () => {
    const tripData = await tripService.getTrip(tripId);
    if (tripData && tripData.user_id === user?.id) {
      setTrip(tripData);
    } else {
      // Redirect if trip doesn't exist or user doesn't own it
      window.location.href = '/chat';
    }
    setLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    // Use existing chat logic with tripId from URL
    const aiResponse = await sendChatMessage({
      message,
      conversationHistory: conversationHistoryWithCurrentMessage,
      tripId
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Trip not found</div>;

  // Return existing chat component with trip context
}
```

**Purpose**: Handles dynamic routing for individual trip chats.

### 4. Modified Chat API

**File**: `src/app/api/chat/route.ts`

**Key Changes**:
- Add trip creation on first message
- Include user_id in trip creation
- Update trip details from AI responses
- Return tripId in response

```typescript
export async function POST(request: NextRequest) {
  // ... existing authentication code ...

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { message, conversationHistory = [], tripId } = body;

  // Create trip on first message
  let currentTripId = tripId;
  if (!currentTripId && conversationHistory.length === 0) {
    currentTripId = await tripService.createTrip(session.user.id);
  }

  // ... existing OpenAI API call ...

  // Update trip if AI provided new details
  if (currentTripId && aiResponse.tripContext) {
    await tripService.updateTrip(currentTripId, {
      origin: aiResponse.tripContext.from,
      destination: aiResponse.tripContext.to,
      departure_date: aiResponse.tripContext.departDate,
      return_date: aiResponse.tripContext.returnDate,
      passenger_count: aiResponse.tripContext.passengers
    });
  }

  // Add tripId to response
  const response = {
    // ... existing response fields ...
    tripId: currentTripId
  };

  return NextResponse.json(response);
}
```

### 5. Migration Files

**File**: `migrations/20241220_143000_create_trips_table.sql`

```sql
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  origin VARCHAR(255),
  destination VARCHAR(255), 
  departure_date DATE,
  return_date DATE,
  passenger_count INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can only access their own trips" ON trips
  FOR ALL USING (auth.uid() = user_id);
```

**File**: `migrations/20241220_143100_add_trips_indexes.sql`

```sql
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_trips_trip_id ON trips(trip_id);
```



## Updated Types

**File**: `src/lib/chat-api.ts`

```typescript
export interface ChatRequest {
  message: string;
  conversationHistory: ChatMessage[];
  tripId?: string; // Add tripId to request
}

export interface ChatResponse {
  // ... existing fields ...
  tripId?: string; // Add tripId to response
}
```

## Implementation Steps

1. **Create migrations folder** and SQL files with timestamps
2. **Create trip utilities** for ID generation
3. **Create trip service** for database operations
4. **Update chat API** to handle trip creation and updates
5. **Create dynamic chat route** for `/chat/[tripId]`
6. **Update types** to include tripId
7. **Run migrations** manually in Supabase SQL editor
8. **Test the implementation** with new chat sessions

## URL Examples

- `/chat/abc123xy` - Chat with trip ID "abc123xy"
- `/chat/def456zw` - Chat with trip ID "def456zw"
- `/chat/ghi789ab` - Chat with trip ID "ghi789ab"

## Security Considerations

- **Row Level Security (RLS)**: Users can only access their own trips
- **Unique Trip IDs**: Prevents trip ID collisions
- **User Authentication**: All operations require valid user session
- **Input Validation**: Trip data is validated before storage

## Testing Checklist

- [ ] Trip creation on first message
- [ ] Trip ID generation (URL-safe)
- [ ] Trip updates from AI responses
- [ ] User access control (can't access others' trips)
- [ ] Dynamic routing works correctly
- [ ] Migration files execute properly
- [ ] Trip data persists across sessions
