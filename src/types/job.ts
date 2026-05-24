export interface Job {
  id: string;
  title: string;
  description: string;
  required_skills: string[]; // Stored as JSONB in Supabase
  experience_level: string | null;
  created_at: string;
  updated_at: string;
  status?: 'open' | 'closed' | 'draft' | string;
  applicant_count?: number;
  avg_match_score?: number;
}

export interface JobInsert {
  title: string;
  description: string;
  required_skills?: string[];
  experience_level?: string | null;
}
