import { Job } from './job';

export interface Candidate {
  id: string;
  job_id: string;
  resume_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'Pending' | 'Shortlisted' | 'Rejected';
  score: number | null;
  skills: string[] | null;
  match_breakdown?: {
    found: string[];
    missing: string[];
    summary: string;
  };
  created_at: string;
  updated_at: string;
  // Joined fields
  job_title?: string | null;
}

export interface Resume {
  id: string;
  job_id: string;
  file_path: string;
  file_name: string;
  raw_text: string | null;
  parsed_skills: string[] | null;
  created_at: string;
}
