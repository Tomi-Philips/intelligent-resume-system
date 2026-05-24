import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';

export interface AIScoreResult {
  score: number;
  found_skills: string[];
  missing_skills: string[];
  summary: string;
}

const rawKey = process.env.GROK_API_KEY || process.env.HUGGINGFACE_API_KEY || '';
const keyPrefix = rawKey.substring(0, 4).toLowerCase();

const isGroq = rawKey.startsWith('gsk') || rawKey.startsWith('sk-');
const isGrok = rawKey.startsWith('xai-');

const grokOrGroq = isGroq || isGrok
  ? new OpenAI({
      apiKey  : rawKey,
      baseURL : isGroq ? 'https://api.groq.com/openai/v1' : 'https://api.x.ai/v1',
    })
  : null;

const hfToken = process.env.HUGGINGFACE_API_KEY;
const hf      = hfToken ? new HfInference(hfToken) : null;

/** Keyword-matching fallback — always produces a reasonable score. */
function heuristicScore(jobDescription: string, resumeText: string): AIScoreResult {
  const PATTERNS = [
    { re: /\breact\b/gi,               label: 'React' },
    { re: /\bnext\.?js\b/gi,           label: 'Next.js' },
    { re: /\btypescript\b/gi,          label: 'TypeScript' },
    { re: /\btailwind\b/gi,            label: 'Tailwind CSS' },
    { re: /\bredux\b/gi,               label: 'Redux' },
    { re: /\bgraphql\b/gi,             label: 'GraphQL' },
    { re: /\brest\s*api\b/gi,          label: 'REST APIs' },
    { re: /\bnode\.?js\b/gi,           label: 'Node.js' },
    { re: /\bexpress(\.js)?\b/gi,      label: 'Express.js' },
    { re: /\bpostgresql\b/gi,          label: 'PostgreSQL' },
    { re: /\bmongodb\b/gi,             label: 'MongoDB' },
    { re: /\bredis\b/gi,               label: 'Redis' },
    { re: /\bdocker\b/gi,              label: 'Docker' },
    { re: /\bkubernetes\b/gi,          label: 'Kubernetes' },
    { re: /\bterraform\b/gi,           label: 'Terraform' },
    { re: /\baws\b/gi,                 label: 'AWS' },
    { re: /\bpython\b/gi,              label: 'Python' },
    { re: /\bplaywright\b/gi,          label: 'Playwright' },
    { re: /\bjest\b/gi,                label: 'Jest' },
    { re: /\breact\s*native\b/gi,      label: 'React Native' },
    { re: /\bflutter\b/gi,             label: 'Flutter' },
    { re: /\bgo\b/gi,                  label: 'Go' },
  ];

  const required = PATTERNS.filter(p =>
    jobDescription.toLowerCase().includes(p.label.toLowerCase())
  );
  if (required.length === 0) {
    return { score: 50, found_skills: [], missing_skills: [],
      summary: 'No matching skills found in job description.' };
  }

  const found   = required.filter(p => p.re.test(resumeText)).map(p => p.label);
  const missing = required.filter(p => !found.includes(p.label)).map(p => p.label);
  const score   = Math.min(100, Math.round((found.length / required.length) * 100));

  let summary =
    score >= 80
      ? `Strong candidate. Proficient in ${found.length}/${required.length} required skills: ${found.join(', ')}.`
      : score >= 60
      ? `Promising — ${found.length}/${required.length} skills matched (${found.join(', ')}). Missing: ${missing.join(', ')}.`
      : `Weak match — only ${found.length}/${required.length} skills found. Missing: ${missing.join(', ')}.`;
  summary += ' *(heuristic fallback)*';

  return { score, found_skills: found, missing_skills: missing, summary };
}

/** Strip code fences from an LLM response before parsing JSON. */
function parseJSON(raw: string): AIScoreResult {
  try {
    const src = raw.includes('```json') ? raw.split('```json')[1].split('```')[0]
             : raw.includes('```')     ? raw.split('```')[1].split('```')[0]
             : raw;
    return JSON.parse(src.trim());
  } catch {
    return { score: 0, found_skills: [], missing_skills: [],
      summary: 'Model returned non-JSON response.' };
  }
}

function buildPrompt(jd: string, resume: string): string {
  return `You are an expert recruiter. Score this resume against the job description and return ONLY valid JSON.

## Job Description
${jd}

## Resume
${resume}

Return ONLY:
{ "score": <0-100>, "found_skills": [...], "missing_skills": [...], "summary": "<1-2 sentence assessment>" }`;
}

export const aiService = {
  async analyzeResume(jobDescription: string, resumeText: string): Promise<AIScoreResult> {
    const prompt = buildPrompt(jobDescription, resumeText);

    try {
      // ── 1. Groq (gsk_ key) or xAI Grok (xai- key) ──────────────────────
      if (grokOrGroq) {
        const model  = isGroq ? 'llama-3.3-70b-versatile'
                    : isGrok ? 'grok-3-latest'
                    : 'grok-3-latest';
        const content = await grokOrGroq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: 'Reply with only valid JSON matching the expected schema.' },
            { role: 'user',   content: prompt },
          ],
          max_tokens: 600,
          temperature: 0.1,
        }).then(r => r.choices[0].message.content || '');
        return parseJSON(content);
      }

      // ── 2. HuggingFace Inference (last resort — model must support chat) ──
      if (hf) {
        const response = await (hf as any).chatCompletion({
          model: 'Qwen/Qwen2.5-72B-Instruct',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 600,
        });
        return parseJSON(response.choices[0].message.content || '');
      }

      // ── 3. No key configured ─────────────────────────────────────────────
      console.warn('No AI API key set. Using heuristic fallback.');
      return heuristicScore(jobDescription, resumeText);
    } catch (error) {
      console.error('AI Analysis Error:', JSON.stringify(error, null, 2));
      console.warn('Falling back to heuristic scoring.');
      return heuristicScore(jobDescription, resumeText);
    }
  },
};
