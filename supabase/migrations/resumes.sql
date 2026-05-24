-- Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    parsed_content TEXT,
    ai_insights JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read resumes" ON public.resumes
    FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert resumes" ON public.resumes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to delete resumes" ON public.resumes
    FOR DELETE USING (auth.role() = 'authenticated');
