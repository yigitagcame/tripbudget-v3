-- Create messages table for chat history
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id VARCHAR(50) REFERENCES trips(trip_id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('user', 'ai')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  cards JSONB,
  follow_up TEXT,
  trip_context JSONB
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only insert their own messages
CREATE POLICY "Users can insert their own messages" ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only read messages from their own trips
CREATE POLICY "Users can read messages from their own trips" ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.trip_id = messages.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

-- Users cannot update or delete messages (read-only)
-- No UPDATE or DELETE policies are created intentionally

-- Add indexes for better performance
CREATE INDEX idx_messages_trip_id ON messages(trip_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_messages_trip_timestamp ON messages(trip_id, timestamp);

-- Add a comment to document the table purpose
COMMENT ON TABLE messages IS 'Chat messages stored for trip conversations - read-only for users'; 