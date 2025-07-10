# Database Migrations

This folder contains SQL migration files for the trip storage system.

## Migration Files

1. `20241220_143000_create_trips_table.sql` - Creates the trips table with proper schema and security policies
2. `20241220_143100_add_trips_indexes.sql` - Adds indexes for better query performance

## How to Run Migrations

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each migration file in order (by timestamp)
4. Verify the table was created successfully

## Table Structure

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

## Security

- Row Level Security (RLS) is enabled
- Users can only access their own trips
- All operations require authentication 