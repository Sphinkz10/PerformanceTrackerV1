-- =====================================================================================
-- FIX ATHLETES INSERT RLS
-- Date: 2026-02-18
-- Description: Allows authenticated users (coaches) to insert into athletes table
-- =====================================================================================

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.athletes;

-- Create policy to allow insertion
CREATE POLICY "Enable insert for authenticated users" 
ON public.athletes FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.athletes TO authenticated;
GRANT ALL ON public.athletes TO service_role;
