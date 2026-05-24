-- Create candidates table
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Pending',
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read candidates" ON public.candidates
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert candidates" ON public.candidates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update candidates" ON public.candidates
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete candidates" ON public.candidates
    FOR DELETE USING (auth.role() = 'authenticated');
