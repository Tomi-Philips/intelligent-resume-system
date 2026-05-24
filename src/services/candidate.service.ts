import { supabase as browserClient } from '../lib/supabaseClient';
import { Candidate, Resume } from '../types/candidate';

/**
 * Helper — fetch a single resume record by its id.
 * Avoids PostgREST embed syntax that breaks silently with @supabase/ssr on server.
 */
async function fetchResume(client: any, resumeId: string): Promise<Resume | undefined> {
  if (!resumeId) return undefined;
  const { data, error } = await client.from('resumes').select('*').eq('id', resumeId).single();
  if (error || !data) return undefined;
  return data as Resume;
}

/**
 * Helper — fetch the job title for a list of candidate job_ids in one call.
 */
async function fetchJobTitles(client: any, jobIds: string[]): Promise<Record<string, string>> {
  if (jobIds.length === 0) return {};
  const { data } = await client
    .from('jobs')
    .select('id, title')
    .in('id', [...new Set(jobIds)]);
  const rows = (data as any[]) ?? [];
  return Object.fromEntries(rows.map(r => [r.id, r.title]));
}

export interface AIInsights {
  found_skills: string[];
  missing_skills: string[];
  summary: string;
  recommendation: 'Strong Hire' | 'Potential Hire' | 'Do Not Hire';
}

export interface CandidateNote {
  id: string;
  candidate_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
}

export interface CandidateWithDetails extends Candidate {
  resume?: Resume;
  job_title?: string;
}

export const candidateService = {
  async getCandidatesByJob(jobId: string, client = browserClient): Promise<CandidateWithDetails[]> {
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('job_id', jobId)
      .order('score', { ascending: false });

    if (error) {
      console.error('Error fetching candidates:', JSON.stringify(error));
      throw error;
    }

    const candidates = (data ?? []) as any[];
    // Fetch linked resumes in one batch
    const resumeIds = candidates.filter(c => c.resume_id).map(c => c.resume_id);
    const resumesMap: Record<string, Resume> = {};
    if (resumeIds.length > 0) {
      const { data: rData } = await client.from('resumes').select('*').in('id', resumeIds);
      (rData ?? []).forEach((r: any) => { resumesMap[r.id] = r as Resume; });
    }

    return candidates.map(c => ({
      ...c,
      resume: c.resume_id ? resumesMap[c.resume_id] ?? undefined : undefined,
    })) as CandidateWithDetails[];
  },

  async getCandidateById(candidateId: string, client = browserClient): Promise<CandidateWithDetails | null> {
    const { data, error } = await client
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    // Handle "not found" gracefully (PGRST116)
    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching candidate by id:', JSON.stringify(error));
      throw error;
    }

    if (!data) return null;

    // Fetch resume separately
    const resume = await fetchResume(client, (data as any).resume_id);

    return { ...(data as any), resume } as CandidateWithDetails;
  },

  async getAllCandidates(client = browserClient): Promise<CandidateWithDetails[]> {
    const { data, error } = await client
      .from('candidates')
      .select('*, job:jobs(title)')
      .order('score', { ascending: false });

    if (error) {
      console.error('Error fetching all candidates:', JSON.stringify(error));
      throw error;
    }

    const candidates = (data ?? []) as any[];

    // Fetch linked resumes in batch
    const resumeIds = candidates.filter(c => c.resume_id).map(c => c.resume_id);
    const resumesMap: Record<string, Resume> = {};
    if (resumeIds.length > 0) {
      const { data: rData } = await client.from('resumes').select('*').in('id', resumeIds);
      (rData ?? []).forEach((r: any) => { resumesMap[r.id] = r as Resume; });
    }

    // Already have job title via embed on candidates query (simpler than separate jobs call here)
    return candidates.map(c => ({
      ...c,
      resume: c.resume_id ? resumesMap[c.resume_id] ?? undefined : undefined,
      job_title: c.job?.title ?? null,
      job: undefined,
    })) as CandidateWithDetails[];
  },

  async updateStatus(
    candidateId: string,
    status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected'
  , client = browserClient): Promise<void> {
    const { error } = await client
      .from('candidates')
      .update({ status })
      .eq('id', candidateId);

    if (error) {
      console.error('Error updating candidate status:', error);
      throw error;
    }
  },

  async getNotes(candidateId: string, client = browserClient): Promise<CandidateNote[]> {
    const { data, error } = await client
      .from('notes')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }

    return data as CandidateNote[];
  },

  async addNote(candidateId: string, content: string, client = browserClient): Promise<CandidateNote> {
    const { data: { session } } = await client.auth.getSession();

    const { data, error } = await client
      .from('notes')
      .insert({
        candidate_id: candidateId,
        user_id: session?.user?.id ?? null,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      throw error;
    }

    return data as CandidateNote;
  },

  async deleteNote(noteId: string, client = browserClient): Promise<void> {
    const { error } = await client
      .from('notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  async getDashboardStats(client = browserClient): Promise<{
    totalJobs: number;
    totalCandidates: number;
    shortlistedCount: number;
    avgScore: number;
  }> {
    const [jobsRes, candidatesRes] = await Promise.all([
      client.from('jobs').select('id', { count: 'exact', head: true }),
      client.from('candidates').select('score, status'),
    ]);

    const candidates = (candidatesRes.data ?? []) as { score: number; status: string }[];
    const shortlistedCount = candidates.filter(
      (c) => c.status === 'shortlisted' || c.status === 'Shortlisted'
    ).length;
    const avgScore =
      candidates.length > 0
        ? Math.round(
            candidates.reduce((acc, c) => acc + (c.score ?? 0), 0) /
              candidates.length
          )
        : 0;

    return {
      totalJobs: jobsRes.count ?? 0,
      totalCandidates: candidates.length,
      shortlistedCount,
      avgScore,
    };
  },

  async getAnalyticsData(client = browserClient): Promise<{
    scoreDistribution: { range: string; count: number }[];
    statusBreakdown: { status: string; count: number }[];
    topJobs: { title: string; avgScore: number; candidateCount: number }[];
    recentCandidates: CandidateWithDetails[];
  }> {
    const { data: candidates } = await client
      .from('candidates')
      .select('score, status, job_id, name, created_at');

    const { data: jobs } = await client
      .from('jobs')
      .select('id, title');

    const allCandidates = (candidates ?? []) as any[];
    const allJobs = (jobs ?? []) as any[];

    // Score distribution buckets
    const buckets = [
      { range: '0-20', min: 0, max: 20 },
      { range: '21-40', min: 21, max: 40 },
      { range: '41-60', min: 41, max: 60 },
      { range: '61-80', min: 61, max: 80 },
      { range: '81-100', min: 81, max: 100 },
    ];
    const scoreDistribution = buckets.map(({ range, min, max }) => ({
      range,
      count: allCandidates.filter(
        (c) => (c.score ?? 0) >= min && (c.score ?? 0) <= max
      ).length,
    }));

    // Status breakdown
    const statusMap: Record<string, number> = {};
    allCandidates.forEach((c) => {
      const s = (c.status ?? 'pending').toLowerCase();
      statusMap[s] = (statusMap[s] ?? 0) + 1;
    });
    const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));

    // Top jobs by avg score
    const jobScoreMap: Record<string, number[]> = {};
    allCandidates.forEach((c) => {
      if (!jobScoreMap[c.job_id]) jobScoreMap[c.job_id] = [];
      jobScoreMap[c.job_id].push(c.score ?? 0);
    });
    const topJobs = allJobs
      .map((j) => ({
        title: j.title,
        avgScore: jobScoreMap[j.id]
          ? Math.round(
              jobScoreMap[j.id].reduce((a, b) => a + b, 0) /
                jobScoreMap[j.id].length
            )
          : 0,
        candidateCount: (jobScoreMap[j.id] ?? []).length,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    // Recent candidates
    const { data: recent } = await client
      .from('candidates')
      .select('*, job:jobs(title)')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentCandidates = ((recent ?? []) as any[]).map((c) => ({
      ...c,
      job_title: c.job?.title ?? null,
      job: undefined,
    }));

    return { scoreDistribution, statusBreakdown, topJobs, recentCandidates };
  },
};
