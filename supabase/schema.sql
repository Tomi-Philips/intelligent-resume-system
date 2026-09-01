-- ==============================================================================
-- DATABASE SCHEMA: Intelligent Resume Screening and Candidate Ranking System
-- Platform: Supabase PostgreSQL with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Extends Supabase Auth users)
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('job_seeker', 'company', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'job_seeker',
    full_name TEXT,
    phone TEXT,
    headline TEXT,
    location TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. COMPANIES (Company entity with unique UUID)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    logo_url TEXT,
    description TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    location TEXT,
    industry TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_company_user UNIQUE (user_id)
);

-- ------------------------------------------------------------------------------
-- 3. JOBS (Vacancies created by companies)
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    preferred_skills TEXT[] DEFAULT '{}',
    experience_years_required NUMERIC NOT NULL DEFAULT 0,
    education_requirement TEXT,
    employment_type TEXT NOT NULL DEFAULT 'Full-time',
    location TEXT NOT NULL DEFAULT 'Remote',
    salary_range TEXT,
    deadline DATE,
    status job_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. RESUMES (Uploaded candidate resumes & extracted text)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_seeker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. APPLICATIONS (Connecting Job Seekers to Jobs)
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM ('pending', 'reviewing', 'shortlisted', 'rejected', 'hired', 'withdrawn');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    job_seeker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE RESTRICT,
    status application_status NOT NULL DEFAULT 'pending',
    notes TEXT, -- Company private review notes
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_candidate_job_application UNIQUE (job_id, job_seeker_id)
);

-- ------------------------------------------------------------------------------
-- 6. AI ANALYSES (Structured Grok screening output)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
    match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    found_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    experience_match TEXT NOT NULL DEFAULT 'Moderate',
    education_match TEXT NOT NULL DEFAULT 'Moderate',
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    summary TEXT NOT NULL,
    raw_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_application_analysis UNIQUE (application_id)
);

-- ------------------------------------------------------------------------------
-- 7. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON public.companies(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_company_id ON public.applications(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_job_seeker_id ON public.applications(job_seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_app_id ON public.ai_analyses(application_id);
CREATE INDEX IF NOT EXISTS idx_ai_analyses_score ON public.ai_analyses(match_score DESC);

-- ------------------------------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;

-- Helper function: Get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Companies Policies
CREATE POLICY "Published company profiles are viewable by everyone"
ON public.companies FOR SELECT
USING (true);

CREATE POLICY "Company owners can manage their company profile"
ON public.companies FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Jobs Policies
CREATE POLICY "Anyone can view published jobs"
ON public.jobs FOR SELECT
USING (status = 'published' OR (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = jobs.company_id AND companies.user_id = auth.uid()
    )
));

CREATE POLICY "Companies can insert jobs"
ON public.jobs FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = company_id AND companies.user_id = auth.uid()
    )
);

CREATE POLICY "Companies can update their own jobs"
ON public.jobs FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = jobs.company_id AND companies.user_id = auth.uid()
    )
);

CREATE POLICY "Companies can delete their own jobs"
ON public.jobs FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = jobs.company_id AND companies.user_id = auth.uid()
    )
);

-- Resumes Policies
CREATE POLICY "Job seekers can view and insert their own resumes"
ON public.resumes FOR ALL
USING (auth.uid() = job_seeker_id)
WITH CHECK (auth.uid() = job_seeker_id);

CREATE POLICY "Companies can view resumes for applications submitted to their jobs"
ON public.resumes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.applications a
        JOIN public.jobs j ON j.id = a.job_id
        JOIN public.companies c ON c.id = j.company_id
        WHERE a.resume_id = resumes.id AND c.user_id = auth.uid()
    )
);

-- Applications Policies
CREATE POLICY "Job seekers can view their own applications"
ON public.applications FOR SELECT
USING (auth.uid() = job_seeker_id);

CREATE POLICY "Job seekers can create applications"
ON public.applications FOR INSERT
WITH CHECK (
    auth.uid() = job_seeker_id AND
    public.get_user_role(auth.uid()) = 'job_seeker'
);

CREATE POLICY "Companies can view applications for their jobs"
ON public.applications FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = applications.company_id AND companies.user_id = auth.uid()
    )
);

CREATE POLICY "Companies can update status and notes of their applications"
ON public.applications FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.companies
        WHERE companies.id = applications.company_id AND companies.user_id = auth.uid()
    )
);

-- AI Analyses Policies
CREATE POLICY "Companies can view AI analyses for their applications"
ON public.ai_analyses FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.applications a
        JOIN public.companies c ON c.id = a.company_id
        WHERE a.id = ai_analyses.application_id AND c.user_id = auth.uid()
    )
);

CREATE POLICY "Job seekers can view AI analyses for their own applications"
ON public.ai_analyses FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.applications a
        WHERE a.id = ai_analyses.application_id AND a.job_seeker_id = auth.uid()
    )
);

-- Run the statements below in your Supabase SQL Editor (Dashboard → SQL Editor)
-- or via `supabase db push` if using local migrations.

-- company-logos: public bucket so logo URLs work without signed URLs
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT DO NOTHING;

-- resumes: private bucket (keep false)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false) ON CONFLICT DO NOTHING;

-- Allow authenticated users to upload their own logo (path must start with their user id)
DROP POLICY IF EXISTS "Company owners can upload logos" ON storage.objects;
CREATE POLICY "Company owners can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Company owners can update/replace logos" ON storage.objects;
CREATE POLICY "Company owners can update/replace logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "Company owners can delete logos" ON storage.objects;
CREATE POLICY "Company owners can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'company-logos'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Public read so logo images load in browsers without auth
DROP POLICY IF EXISTS "Anyone can view company logos" ON storage.objects;
CREATE POLICY "Anyone can view company logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

-- ------------------------------------------------------------------------------
-- 10. AUTH TRIGGER (Automatically create public.profiles on new auth.users signup)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role_val public.user_role;
    user_name_val TEXT;
BEGIN
    user_role_val := COALESCE(
        (NEW.raw_user_meta_data->>'role')::public.user_role,
        'job_seeker'::public.user_role
    );
    
    user_name_val := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        user_role_val,
        user_name_val
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();

    IF user_role_val = 'company' AND (NEW.raw_user_meta_data->>'company_name') IS NOT NULL THEN
        INSERT INTO public.companies (user_id, name, email)
        VALUES (
            NEW.id,
            NEW.raw_user_meta_data->>'company_name',
            NEW.email
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill any existing auth users who might be missing a profile record
INSERT INTO public.profiles (id, email, role, full_name)
SELECT 
    id, 
    email, 
    COALESCE((raw_user_meta_data->>'role')::public.user_role, 'job_seeker'::public.user_role),
    COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;


