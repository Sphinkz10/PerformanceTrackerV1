-- =====================================================================================
-- DEBUG: OPEN RLS FOR ATHLETES
-- Date: 2026-02-18
-- Description: Temporarily allows ANYONE (including anonymous) to insert athletes.
-- USE ONLY FOR DEBUGGING.
-- =====================================================================================

-- 1. Drop strict policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.athletes;
DROP POLICY IF EXISTS "Users can insert athletes" ON public.athletes;

-- 2. Create PERMISSIVE policy (Public)
CREATE POLICY "Debug Open Insert"
ON public.athletes FOR INSERT
TO public
WITH CHECK (true);

-- 3. Ensure RLS is enabled (or disabled if we really want to force it, but better to keep enabled with open policy)
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- 4. Grant permissions to anon as well
GRANT ALL ON public.athletes TO anon;
GRANT ALL ON public.athletes TO authenticated;
GRANT ALL ON public.athletes TO service_role;
