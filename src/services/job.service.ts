import { supabase as browserClient } from '../lib/supabaseClient';
import { Job, JobInsert } from '../types/job';

export const jobService = {
  async getJobs(client = browserClient): Promise<Job[]> {
    const { data, error } = await client
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }

    return data as Job[];
  },

  async getJobById(id: string, client = browserClient): Promise<Job | null> {
    const { data, error } = await client
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      console.error('Error fetching job by id:', error);
      throw error;
    }

    return data as Job;
  },

  async createJob(jobInsert: JobInsert, client = browserClient): Promise<Job> {
    const { data: { session } } = await client.auth.getSession();

    if (!session?.user) {
      throw new Error('You must be logged in to create a job.');
    }

    const { data, error } = await client
      .from('jobs')
      .insert({
        ...jobInsert,
        user_id: session.user.id,
        required_skills: jobInsert.required_skills || [],
        experience_level: jobInsert.experience_level || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      throw error;
    }

    return data as Job;
  },

  async updateJob(id: string, updates: Partial<JobInsert>, client = browserClient): Promise<Job> {
    const { data, error } = await client
      .from('jobs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating job:', error);
      throw error;
    }

    return data as Job;
  },

  async deleteJob(id: string, client = browserClient): Promise<void> {
    const { error } = await client
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  async getJobStats(jobId: string, client = browserClient): Promise<{
    totalCandidates: number;
    avgScore: number;
    topScore: number;
    shortlistedCount: number;
  }> {
    const { data } = await client
      .from('candidates')
      .select('score, status')
      .eq('job_id', jobId);

    const candidates = (data ?? []) as { score: number; status: string }[];
    const scores = candidates.map((c) => c.score ?? 0);
    const shortlistedCount = candidates.filter(
      (c) => c.status === 'shortlisted' || c.status === 'Shortlisted'
    ).length;

    return {
      totalCandidates: candidates.length,
      avgScore:
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0,
      topScore: scores.length > 0 ? Math.max(...scores) : 0,
      shortlistedCount,
    };
  },
};
