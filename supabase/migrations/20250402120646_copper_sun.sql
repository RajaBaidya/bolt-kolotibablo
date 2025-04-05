/*
  # Add admin flag and withdrawal system
  
  1. Updates
    - Add admin flag to profiles table
    - Add withdrawal_requests table for managing user withdrawals
    - Add is_banned flag to profiles
    - Add earnings tracking to users table
  
  2. Security
    - Enable RLS on withdrawal_requests
    - Add policies for withdrawal management
*/

-- Add admin and banned flags to profiles
ALTER TABLE profiles 
ADD COLUMN is_admin BOOLEAN DEFAULT false,
ADD COLUMN is_banned BOOLEAN DEFAULT false;

-- Add earnings to users
ALTER TABLE users
ADD COLUMN earnings INTEGER DEFAULT 0,
ADD COLUMN completed_tasks INTEGER DEFAULT 0;

-- Create withdrawal requests table
CREATE TABLE withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMPTZ DEFAULT now(),
  processed_at TIMESTAMPTZ
);

ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Policies for withdrawal requests
CREATE POLICY "Users can view their own withdrawal requests"
ON withdrawal_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create withdrawal requests"
ON withdrawal_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all withdrawal requests"
ON withdrawal_requests
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  )
);

CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_admin = true
  )
);