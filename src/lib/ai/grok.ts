import { AIAnalysis } from '@/types/database';
import { performClassicalNLPAnalysis } from './nlp-engine';

export interface EvaluateCandidateParams {
  resumeText: string;
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  experienceYearsRequired?: number;
}

export type CandidateEvaluation = Omit<AIAnalysis, 'id' | 'application_id' | 'created_at' | 'updated_at'>;

export async function evaluateCandidateResume({
  resumeText,
  jobTitle,
  jobDescription,
  requiredSkills = [],
  preferredSkills = [],
  experienceYearsRequired = 0,
}: EvaluateCandidateParams): Promise<CandidateEvaluation> {
  const apiKey = (process.env.GROK_API_KEY || process.env.XAI_API_KEY || process.env.GROQ_API_KEY || '').trim();

  // Compute Classical NLP baseline for validation & academic defensibility
  const nlpBaseline = performClassicalNLPAnalysis(
    resumeText,
    jobTitle,
    jobDescription,
    requiredSkills,
    preferredSkills
  );

  // If no API Key is configured, return the high-fidelity NLP baseline
  if (!apiKey || apiKey.startsWith('placeholder') || apiKey.length < 10) {
    return {
      match_score: nlpBaseline.match_score,
      found_skills: nlpBaseline.found_skills,
      missing_skills: nlpBaseline.missing_skills,
      experience_match: nlpBaseline.experience_match,
      education_match: nlpBaseline.education_match,
      strengths: nlpBaseline.strengths,
      weaknesses: nlpBaseline.weaknesses,
      summary: nlpBaseline.summary,
      raw_response: {
        engine: 'classical_nlp_tfidf_cosine',
        cosine_similarity: nlpBaseline.cosine_similarity,
      },
    };
  }

  // Detect provider: Groq (gsk_...) vs xAI / OpenAI
  const isGroq = apiKey.startsWith('gsk_');
  const defaultBaseUrl = isGroq ? 'https://api.groq.com/openai/v1' : 'https://api.x.ai/v1';
  const defaultModel = isGroq ? 'qwen/qwen3.6-27b' : 'grok-2-latest';

  const baseUrl = process.env.GROK_API_BASE_URL || defaultBaseUrl;
  const model = process.env.GROK_MODEL || defaultModel;

  // Call Grok / LLM API with structured JSON system prompt
  try {
    const prompt = `You are an expert AI recruitment assistant performing an objective, transparent resume screening and candidate evaluation.

JOB POSITION:
- Title: ${jobTitle}
- Required Skills: ${requiredSkills.join(', ')}
- Preferred Skills: ${preferredSkills.join(', ')}
- Experience Required: ${experienceYearsRequired} years
- Job Description:
${jobDescription}

CANDIDATE RESUME TEXT:
${resumeText.slice(0, 8000)}

INSTRUCTIONS:
1. Compare the candidate's resume strictly against the job requirements.
2. DO NOT fabricate or hallucinate any skills, degrees, or experience not mentioned in the resume.
3. Identify explicitly found skills and missing required skills.
4. Calculate a realistic Match Score from 0 to 100 based on skill coverage, years of experience, and role alignment.
5. Return ONLY a valid JSON object matching the following schema:

{
  "match_score": number (0-100),
  "found_skills": string[],
  "missing_skills": string[],
  "experience_match": "Strong" | "Moderate" | "Low" | "Gaps Detected",
  "education_match": "Strong" | "Good" | "Adequate" | "Unmatched",
  "strengths": string[],
  "weaknesses": string[],
  "summary": string
}`;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a specialized AI candidate screening model. You output strict, valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      console.warn(`AI API returned status ${response.status}. Utilizing NLP baseline engine.`);
      return {
        match_score: nlpBaseline.match_score,
        found_skills: nlpBaseline.found_skills,
        missing_skills: nlpBaseline.missing_skills,
        experience_match: nlpBaseline.experience_match,
        education_match: nlpBaseline.education_match,
        strengths: nlpBaseline.strengths,
        weaknesses: nlpBaseline.weaknesses,
        summary: nlpBaseline.summary,
        raw_response: { fallback: true, httpStatus: response.status },
      };
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return {
      match_score: Math.max(0, Math.min(100, Math.round(parsed.match_score ?? nlpBaseline.match_score))),
      found_skills: Array.isArray(parsed.found_skills) && parsed.found_skills.length > 0
        ? parsed.found_skills
        : nlpBaseline.found_skills,
      missing_skills: Array.isArray(parsed.missing_skills) && parsed.missing_skills.length > 0
        ? parsed.missing_skills
        : nlpBaseline.missing_skills,
      experience_match: parsed.experience_match || nlpBaseline.experience_match,
      education_match: parsed.education_match || nlpBaseline.education_match,
      strengths: Array.isArray(parsed.strengths) && parsed.strengths.length > 0
        ? parsed.strengths
        : nlpBaseline.strengths,
      weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length > 0
        ? parsed.weaknesses
        : nlpBaseline.weaknesses,
      summary: parsed.summary || nlpBaseline.summary,
      raw_response: json,
    };
  } catch (err: unknown) {
    console.error('Error invoking AI API, utilizing NLP fallback:', err);
    return {
      match_score: nlpBaseline.match_score,
      found_skills: nlpBaseline.found_skills,
      missing_skills: nlpBaseline.missing_skills,
      experience_match: nlpBaseline.experience_match,
      education_match: nlpBaseline.education_match,
      strengths: nlpBaseline.strengths,
      weaknesses: nlpBaseline.weaknesses,
      summary: nlpBaseline.summary,
      raw_response: { fallback: true, error: err instanceof Error ? err.message : 'Unknown' },
    };
  }
}

