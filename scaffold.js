const fs = require('fs');
const path = require('path');

const dirs = [
  'src/app/(auth)/signup',
  'src/app/(auth)/forgot-password',
  'src/app/(app)/candidates',
  'src/app/(app)/insights',
  'src/app/(app)/reports',
  'src/app/(app)/settings',
  'src/app/api/ai/embeddings',
  'src/app/api/ai/ranking',
  'src/app/api/jobs',
  'src/app/api/candidates',
  'src/components/ui',
  'src/components/dashboard',
  'src/components/jobs',
  'src/components/candidates',
  'src/components/resumes',
  'src/components/ai',
  'src/components/auth',
  'src/lib/ai',
  'src/services',
  'src/hooks',
  'src/store',
  'src/types',
  'src/constants',
  'supabase/migrations'
];

dirs.forEach(d => fs.mkdirSync(d, { recursive: true }));

// Moving login
if (fs.existsSync('src/app/login/page.tsx')) {
  fs.mkdirSync('src/app/(auth)/login', { recursive: true });
  fs.renameSync('src/app/login/page.tsx', 'src/app/(auth)/login/page.tsx');
  try { fs.rmdirSync('src/app/login', { recursive: true }); } catch (e) {}
}

// Pages
const pages = {
  'src/app/(auth)/signup/page.tsx': "export default function SignupPage() { return <div className='p-8'>Signup Page</div>; }",
  'src/app/(auth)/forgot-password/page.tsx': "export default function ForgotPasswordPage() { return <div className='p-8'>Forgot Password</div>; }",
  'src/app/(app)/candidates/page.tsx': "export default function GlobalCandidatesPage() { return <div className='p-8'>All Candidates</div>; }",
  'src/app/(app)/insights/page.tsx': "export default function InsightsPage() { return <div className='p-8'>Insights & Analytics</div>; }",
  'src/app/(app)/reports/page.tsx': "export default function ReportsPage() { return <div className='p-8'>Reports & Export</div>; }",
  'src/app/(app)/settings/page.tsx': "export default function SettingsPage() { return <div className='p-8'>Settings</div>; }"
};

for (const [file, content] of Object.entries(pages)) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, content);
}

// APIs
const apis = {
  'src/app/api/ai/embeddings/route.ts': "export async function POST() { return new Response('OK'); }",
  'src/app/api/ai/ranking/route.ts': "export async function POST() { return new Response('OK'); }",
  'src/app/api/jobs/route.ts': "export async function GET() { return new Response('OK'); }",
  'src/app/api/candidates/route.ts': "export async function GET() { return new Response('OK'); }"
};

for (const [file, content] of Object.entries(apis)) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, content);
}

// Components
const components = [
  'src/components/ui/Modal.tsx',
  'src/components/ui/Table.tsx',
  'src/components/dashboard/ActivityFeed.tsx',
  'src/components/dashboard/TopCandidates.tsx',
  'src/components/jobs/JobDescriptionAnalyzer.tsx',
  'src/components/candidates/CandidateCard.tsx',
  'src/components/candidates/CandidateProfile.tsx',
  'src/components/resumes/ResumePreview.tsx',
  'src/components/resumes/ResumeParserView.tsx',
  'src/components/ai/SkillExtractor.tsx',
  'src/components/ai/RankingVisualizer.tsx',
  'src/components/auth/LoginForm.tsx',
  'src/components/auth/SignupForm.tsx'
];

components.forEach(c => {
  if (!fs.existsSync(c)) {
    const name = path.basename(c, '.tsx');
    fs.writeFileSync(c, `export function ${name}() { return <div>${name} Component Placeholder</div>; }`);
  }
});

// Stubs
const stubs = {
  'src/lib/authHelpers.ts': "export const isAuthenticated = false;",
  'src/lib/apiClient.ts': "export const api = {};",
  'src/lib/utils.ts': "export const cn = () => '';",
  'src/lib/ai/embeddings.ts': "export const generateEmbeddings = () => {};",
  'src/lib/ai/similarity.ts': "export const calculateSimilarity = () => {};",
  'src/lib/ai/scoring.ts': "export const computeScore = () => {};",
  'src/services/ranking.service.ts': "export const rankingService = {};",
  'src/services/analytics.service.ts': "export const analyticsService = {};",
  'src/hooks/useAuth.ts': "export const useAuth = () => {};",
  'src/hooks/useJobs.ts': "export const useJobs = () => {};",
  'src/hooks/useCandidates.ts': "export const useCandidates = () => {};",
  'src/hooks/useResumes.ts': "export const useResumes = () => {};",
  'src/hooks/useAI.ts': "export const useAI = () => {};",
  'src/store/authStore.ts': "export const useAuthStore = () => {};",
  'src/store/jobStore.ts': "export const useJobStore = () => {};",
  'src/store/candidateStore.ts': "export const useCandidateStore = () => {};",
  'src/types/user.ts': "export type User = {};",
  'src/types/job.ts': "export type Job = {};",
  'src/types/resume.ts': "export type Resume = {};",
  'src/types/candidate.ts': "export type Candidate = {};",
  'src/types/score.ts': "export type Score = {};",
  'src/constants/roles.ts': "export const ROLES = {};",
  'src/constants/scoringWeights.ts': "export const SCORING_WEIGHTS = {};",
  'src/constants/config.ts': "export const CONFIG = {};"
};

for (const [file, content] of Object.entries(stubs)) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, content);
}

// Migrations
const migrations = [
  'supabase/migrations/users.sql',
  'supabase/migrations/scores.sql',
  'supabase/migrations/notes.sql'
];

migrations.forEach(m => {
  if (!fs.existsSync(m)) fs.writeFileSync(m, "-- SQL Migration Placeholder");
});

console.log('Scaffolding complete!');
