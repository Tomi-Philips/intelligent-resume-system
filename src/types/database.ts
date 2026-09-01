export type UserRole = 'job_seeker' | 'company' | 'admin';
export type JobStatus = 'draft' | 'published' | 'closed';
export type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired' | 'withdrawn';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string | null;
  phone?: string | null;
  headline?: string | null;
  location?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  education?: Array<{
    institution: string;
    degree: string;
    field_of_study?: string;
    start_year?: string;
    end_year?: string;
  }> | null;
  experience?: Array<{
    company: string;
    position: string;
    start_date?: string;
    end_date?: string;
    description?: string;
  }> | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  name: string;
  logo_url?: string | null;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  location?: string | null;
  industry?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  title: string;
  description: string;
  required_skills: string[];
  preferred_skills?: string[];
  experience_years_required: number;
  education_requirement?: string | null;
  employment_type: string;
  location: string;
  salary_range?: string | null;
  deadline?: string | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  company?: Company;
  applications_count?: number;
}

export interface Resume {
  id: string;
  job_seeker_id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  extracted_text: string;
  created_at: string;
}

export interface AIAnalysis {
  id: string;
  application_id: string;
  match_score: number;
  found_skills: string[];
  missing_skills: string[];
  experience_match: 'Strong' | 'Moderate' | 'Low' | 'Gaps Detected';
  education_match: 'Strong' | 'Good' | 'Adequate' | 'Unmatched';
  strengths: string[];
  weaknesses: string[];
  summary: string;
  raw_response?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  company_id: string;
  job_seeker_id: string;
  resume_id: string;
  status: ApplicationStatus;
  notes?: string | null;
  submitted_at: string;
  updated_at: string;
  job?: Job;
  job_seeker?: Profile;
  resume?: Resume;
  ai_analysis?: AIAnalysis | null;
  company?: Company;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeApplication(app: any): JobApplication {
  if (!app) return app;
  const analysis = Array.isArray(app.ai_analysis)
    ? (app.ai_analysis[0] || null)
    : (app.ai_analysis || null);

  return {
    ...app,
    ai_analysis: analysis,
  } as JobApplication;
}

