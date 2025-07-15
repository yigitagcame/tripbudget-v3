-- Migration: Restrict message counter access - users can only read their own records
-- Date: 2024-12-22

-- Enable RLS on user_message_counters table if not already enabled
ALTER TABLE user_message_counters ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Users can read their own message counter" ON user_message_counters;
DROP POLICY IF EXISTS "Users can update their own message counter" ON user_message_counters;
DROP POLICY IF EXISTS "Users can insert their own message counter" ON user_message_counters;
DROP POLICY IF EXISTS "Users can delete their own message counter" ON user_message_counters;

-- Create policy that allows users to ONLY READ their own message counter
CREATE POLICY "Users can only read their own message counter" ON user_message_counters
  FOR SELECT
  USING (auth.uid() = user_id);

-- No policies for INSERT, UPDATE, or DELETE - this effectively blocks all modifications
-- Only server-side functions with elevated privileges can modify message counters

-- Add comment to document the restriction
COMMENT ON TABLE user_message_counters IS 'Message counter records - users can only read, all modifications must go through server-side functions'; 