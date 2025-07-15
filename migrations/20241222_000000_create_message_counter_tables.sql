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