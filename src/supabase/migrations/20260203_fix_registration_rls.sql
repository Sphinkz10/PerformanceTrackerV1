-- =====================================================================================
-- FIX REGISTRATION RLS & MEMBERSHIP
-- Date: 2026-02-03
-- Description: Unblocks registration by allowing INSERT on users table and auto-creating workspace membership
-- =====================================================================================

-- 1. Allow authenticated users to INSERT their own profile
-- This fixes the "new row violates row-level security policy for table users" error
CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Allow users to UPDATE their own profile
CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- 3. Allow authenticated users to INSERT into athletes (for the athlete signup flow)
CREATE POLICY "Users can insert athletes" 
ON athletes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 4. Create Trigger to automatically add user to workspace_members
-- This ensures the RLS policies for other tables (that rely on workspace_members) work correctly
CREATE OR REPLACE FUNCTION public.handle_new_user_workspace_membership() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (NEW.workspace_id, NEW.id, NEW.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if trigger exists before creating to avoid errors on multiple runs
DROP TRIGGER IF EXISTS on_user_created_add_membership ON public.users;

CREATE TRIGGER on_user_created_add_membership
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_workspace_membership();

-- 5. Grant permissions (just in case)
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.workspace_members TO authenticated;
GRANT ALL ON public.athletes TO authenticated;
GRANT ALL ON public.workspaces TO authenticated;
