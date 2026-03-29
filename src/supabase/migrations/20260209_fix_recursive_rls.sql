-- =====================================================================================
-- FIX RECURSIVE RLS ON USERS TABLE
-- Date: 2026-02-09
-- Description: Drops potentially recursive policies and replaces them with simple auth.uid() checks.
-- This prevents the infinite loop during login.
-- =====================================================================================

-- 1. Drop existing policies on users to clear the slate
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for workspace members" ON public.users; -- Potential culprit if it existed

-- 2. Create simple, non-recursive policies
-- SELECT: Only see your own profile
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- INSERT: Only insert your own profile
CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- UPDATE: Only update your own profile
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- 3. Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Grant permissions (safety measure)
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
