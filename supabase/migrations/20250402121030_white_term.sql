/*
  # Add Profile Policies for Signup
  
  1. Updates
    - Add policies to allow profile creation during signup
    - Add policy for username availability check
  
  2. Security
    - Enable policies for profile management during signup process
*/

-- Policy to allow users to create their own profile
CREATE POLICY "Users can create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy to allow checking username availability
CREATE POLICY "Anyone can check username availability"
ON profiles
FOR SELECT
TO authenticated
USING (true);