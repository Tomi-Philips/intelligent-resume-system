-- INITIAL SCHEMA FOR MINDED AI RESUME SYSTEM

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS jobs;

-- 3. Create Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    department TEXT,
    description TEXT,
    required_skills TEXT[] DEFAULT '{}',
    experience_level TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Resumes Table (Holds the uploaded file metadata and parsed text)
CREATE TABLE resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    raw_text TEXT,
    parsed_skills TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Candidates Table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    skills TEXT[] DEFAULT '{}',
    score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'rejected')),
    match_breakdown JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create Notes Table (Recruiter notes on candidates)
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Setup Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies for Jobs (Users can only see and edit their own jobs)
CREATE POLICY "Users can view their own jobs"
ON jobs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own jobs"
ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
ON jobs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own jobs"
ON jobs FOR DELETE USING (auth.uid() = user_id);

-- Policies for Candidates (Can view candidates linked to their jobs)
CREATE POLICY "Users can view candidates for their jobs"
ON candidates FOR SELECT USING (
    job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

CREATE POLICY "Users can insert candidates"
ON candidates FOR INSERT WITH CHECK (
    job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

CREATE POLICY "Users can update candidates"
ON candidates FOR UPDATE USING (
    job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

CREATE POLICY "Users can delete candidates"
ON candidates FOR DELETE USING (
    job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);

-- Policies for Resumes
CREATE POLICY "Authenticated users can access resumes"
ON resumes FOR ALL USING (auth.role() = 'authenticated');

-- Policies for Notes
CREATE POLICY "Authenticated users can access notes"
ON notes FOR ALL USING (auth.role() = 'authenticated');

-- 8. Triggers to keep updated_at fresh
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER candidates_updated_at
    BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
