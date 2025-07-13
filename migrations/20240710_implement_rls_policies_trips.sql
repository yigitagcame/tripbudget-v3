-- Enable Row Level Security for trips table
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to create a trip
CREATE POLICY "Users can create trips" ON trips
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to read only their own trips
CREATE POLICY "Users can read their own trips" ON trips
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update only their own trips
CREATE POLICY "Users can update their own trips" ON trips
  FOR UPDATE
  USING (auth.uid() = user_id);

-- (Optional) Allow users to delete only their own trips
-- CREATE POLICY "Users can delete their own trips" ON trips
--   FOR DELETE
--   USING (auth.uid() = user_id); 