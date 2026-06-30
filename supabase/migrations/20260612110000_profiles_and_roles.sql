-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT CHECK (role IN ('recruiter', 'user', 'super_admin')) DEFAULT 'user',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Populate Profiles for Existing Users
INSERT INTO public.profiles (id, full_name, email, role, status)
SELECT 
    id,
    COALESCE(raw_user_meta_data->>'full_name', email),
    email,
    COALESCE(raw_user_meta_data->>'role', 'recruiter'),
    'active'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 3. Create Trigger Function to Sync new auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, status)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.email),
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'user'),
        'active'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for keeping profiles updated_at fresh
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Helper function to check for super_admin role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = user_id AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for Profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
CREATE POLICY "Super admins can view all profiles"
ON public.profiles FOR SELECT
USING (
  public.is_super_admin(auth.uid())
);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Super admins can update any profile" ON public.profiles;
CREATE POLICY "Super admins can update any profile"
ON public.profiles FOR UPDATE
USING (
  public.is_super_admin(auth.uid())
);

-- 5. RLS Policies for Jobs
DROP POLICY IF EXISTS "Users can view their own jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view jobs" ON jobs;
CREATE POLICY "Users can view jobs"
ON jobs FOR SELECT USING (
  auth.uid() = user_id 
  OR 
  (status = 'open' AND auth.role() = 'authenticated')
  OR
  public.is_super_admin(auth.uid())
);

DROP POLICY IF EXISTS "Super admins can do anything on jobs" ON jobs;
CREATE POLICY "Super admins can do anything on jobs"
ON jobs FOR ALL USING (
  public.is_super_admin(auth.uid())
);

-- 6. RLS Policies for Candidates
DROP POLICY IF EXISTS "Users can view candidates for their jobs" ON candidates;
DROP POLICY IF EXISTS "Users can view candidates" ON candidates;
CREATE POLICY "Users can view candidates"
ON candidates FOR SELECT USING (
  job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
  OR
  email = (auth.jwt() ->> 'email')
  OR
  public.is_super_admin(auth.uid())
);

DROP POLICY IF EXISTS "Candidates can be inserted by anyone authenticated" ON candidates;
CREATE POLICY "Candidates can be inserted by anyone authenticated"
ON candidates FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Super admins can do anything on candidates" ON candidates;
CREATE POLICY "Super admins can do anything on candidates"
ON candidates FOR ALL USING (
  public.is_super_admin(auth.uid())
);

-- 7. RLS Policies for Resumes
DROP POLICY IF EXISTS "Authenticated users can access resumes" ON resumes;
DROP POLICY IF EXISTS "Users can access resumes" ON resumes;
CREATE POLICY "Users can access resumes"
ON resumes FOR ALL USING (
  auth.role() = 'authenticated'
);

-- 8. Functions for Self-Deletion and Admin-Deletion
CREATE OR REPLACE FUNCTION public.delete_own_user()
RETURNS VOID AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.delete_user_by_admin(target_user_id UUID)
RETURNS VOID AS $$
BEGIN
  IF public.is_super_admin(auth.uid()) THEN
    DELETE FROM auth.users WHERE id = target_user_id;
  ELSE
    RAISE EXCEPTION 'Only super admins can delete users';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
