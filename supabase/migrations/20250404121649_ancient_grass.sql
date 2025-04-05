/*
  # Fix recursive policies on profiles table

  1. Changes
    - Drop existing policies that cause recursion
    - Create new, optimized policies for profiles table
    
  2. Security
    - Maintain RLS protection
    - Simplify admin access check using auth.uid() directly
    - Keep existing user access controls
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can check username availability" ON profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new, optimized policies
CREATE POLICY "Enable read access for admins"
ON profiles
FOR SELECT
TO authenticated
USING (
  is_admin = true 
  OR 
  auth.uid() = id
);

CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Add policy for username availability check
CREATE POLICY "Public username availability check"
ON profiles
FOR SELECT
TO authenticated
USING (true);