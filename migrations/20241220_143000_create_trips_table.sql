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

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Users can only access their own trips
CREATE POLICY "Users can only access their own trips" ON trips
  FOR ALL USING (auth.uid() = user_id); 