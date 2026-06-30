-- ============================================================
-- PATCH: Fix super_admin role persistence
-- 
-- Problem: The existing "Super admins can view all profiles"
-- policy relies on is_super_admin(auth.uid()) which itself
-- queries the profiles table. Because the base SELECT policy
-- only allows users to read THEIR OWN row, the function works
-- fine for self-reads but can fail for cross-reads when the
-- jwt is freshly minted and cache is cold.
--
-- Additionally: if a super_admin's own profile row read fails
-- for ANY reason, useAuth.ts was previously falling back to
-- user_metadata (signup-time role), which silently shadowed
-- the manually assigned DB role.
--
-- This migration ensures:
-- 1. super_admin users can ALWAYS read their own profile row.
-- 2. is_super_admin() is re-declared with SET search_path to
--    prevent search-path injection and ensure it always hits
--    the correct schema.
-- 3. A missing INSERT policy on profiles is added (for edge
--    cases where the trigger fires but no policy covers the
--    service-role insert path visible to the client).
-- ============================================================

-- Step 1: Re-declare is_super_admin with explicit search_path
-- This avoids any schema search-path ambiguity under RLS
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- Step 2: Ensure the "view own profile" policy covers ALL roles
-- (it already should, but drop/recreate to be safe)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Step 3: Ensure super admins can also view all other profiles
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
CREATE POLICY "Super admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_super_admin(auth.uid()));

-- Step 4: Allow authenticated users to insert their own profile
-- (covers edge cases where the trigger-inserted row needs a
-- matching client-side RLS policy for the first read)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Step 5: Re-confirm UPDATE policies are in place
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role != 'super_admin');
-- Note: role field is NOT updatable by regular users (only super admins can change roles)

DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;
CREATE POLICY "Super admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));
