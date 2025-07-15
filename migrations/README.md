# Database Migrations

This folder contains SQL migration files for the trip storage system.

## Migration Files

1. `20241220_143000_create_trips_table.sql` - Creates the trips table with proper schema and security policies
2. `20241220_143100_add_trips_indexes.sql` - Adds indexes for better query performance
3. `20241221_000000_enable_realtime_trips.sql` - Enables realtime subscriptions for trips table
4. `20241221_143000_create_messages_table.sql` - Creates the messages table for chat functionality
5. `20241222_000000_create_message_counter_tables.sql` - Creates message counter and referral tables

## How to Run Migrations

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each migration file in order (by timestamp)
4. Verify the table was created successfully

## Table Structure

### Trips Table
The `trips` table includes:
- `id` - UUID primary key
- `trip_id` - Unique 8-character string for URL routing
- `user_id` - References auth.users(id)
- `origin` - Departure location
- `destination` - Arrival location
- `departure_date` - Trip start date
- `return_date` - Trip end date
- `passenger_count` - Number of travelers
- `created_at` - Timestamp of creation

### Message Counter Tables
The message counter system includes two tables:

#### user_message_counters
- `id` - UUID primary key
- `user_id` - References auth.users(id), unique constraint
- `message_count` - Integer count of remaining messages
- `created_at` - Timestamp of creation
- `updated_at` - Timestamp of last update

#### user_referrals
- `id` - UUID primary key
- `referrer_id` - References auth.users(id) of the referrer
- `referee_email` - Email of the person being referred
- `referral_code` - Unique referral code string
- `is_used` - Boolean flag indicating if code was used
- `used_at` - Timestamp when code was used
- `created_at` - Timestamp of creation

## Security

- Row Level Security (RLS) is enabled
- Users can only access their own trips
- All operations require authentication 