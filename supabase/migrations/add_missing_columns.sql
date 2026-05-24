-- Non-destructive migration for existing deployments
-- Run this if you already applied setup.sql and need the new columns

-- Add missing columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level TEXT;

-- Add missing columns to candidates table
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- Add missing delete policy for candidates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'candidates' AND policyname = 'Users can delete candidates'
  ) THEN
    CREATE POLICY "Users can delete candidates"
    ON candidates FOR DELETE USING (
      job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
    );
  END IF;
END $$;

-- Add update trigger for jobs if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'jobs_updated_at') THEN
    CREATE TRIGGER jobs_updated_at
        BEFORE UPDATE ON jobs
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'candidates_updated_at') THEN
    CREATE TRIGGER candidates_updated_at
        BEFORE UPDATE ON candidates
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
