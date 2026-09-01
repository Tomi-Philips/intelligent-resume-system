# MASTER DEVELOPMENT PROMPT

## Intelligent Resume Screening and Candidate Ranking System Using NLP Techniques (TF-IDF, Cosine Similarity) and BERT-Based Semantic Embeddings

Act as a senior full-stack software engineer, software architect, AI integration engineer, database designer, cybersecurity engineer, product designer, and professional UI/UX designer.

Build a complete, production-quality web-based application titled:

**"An Intelligent Resume Screening and Candidate Ranking System Using NLP Techniques (TF-IDF, Cosine Similarity) and BERT-Based Semantic Embeddings."**

This is an academic final-year software project, but the finished application must feel like a genuine, professionally designed recruitment technology product rather than a school project, generic dashboard, AI-generated template, or simple CRUD application.

The application must be functional end-to-end. Do not create fake functionality, hard-coded dashboard statistics, simulated authentication, meaningless buttons, placeholder workflows, or static records pretending to be real data.

The implementation must follow the requirements below exactly.

---

# 1. PROJECT OVERVIEW

The system is an intelligent web-based recruitment platform designed to improve the process of screening and evaluating job applicants.

The platform connects companies that have employment opportunities with job seekers looking for employment.

Companies create and publish job vacancies. Job seekers browse available vacancies, select jobs they are interested in, complete an application, provide their relevant information, and upload their CV/resume.

Once an application is submitted, the system processes the candidate's resume against the requirements of the relevant job. The AI layer uses a pre-trained language model through the Grok API to perform the computationally intensive natural-language analysis.

The system should extract and evaluate information such as:

* Skills
* Experience
* Education
* Relevant qualifications
* Job requirements
* Matching skills
* Missing skills
* Candidate strengths
* Candidate weaknesses
* Overall suitability
* Match score
* Candidate assessment

The resulting evaluation should assist the company in reviewing applicants and identifying stronger candidates more efficiently.

The system must not present AI results as an unquestionable hiring decision. The AI should function as a decision-support and screening mechanism, while the company remains responsible for recruitment decisions.

---

# 2. CORE PROJECT PURPOSE

The fundamental purpose of the system is to reduce the manual effort involved in reviewing large numbers of resumes while providing companies with a structured and transparent way of comparing applicants against specific job requirements.

The platform should make recruitment more organized by connecting:

**Company → Job Vacancy → Job Seeker → Application → Resume → AI Analysis → Candidate Ranking → Recruitment Decision**

The application should focus strongly on this workflow.

Do not transform the project into a generic social network, job marketplace, messaging platform, HR management suite, or general-purpose SaaS product.

---

# 3. APPROVED ACADEMIC CONTEXT

The approved project topic refers to:

* Natural Language Processing
* TF-IDF
* Cosine Similarity
* BERT-based semantic embeddings
* Automated resume screening
* Candidate ranking

These concepts must remain part of the project's academic identity and documentation.

However, do not falsely implement or claim that the application is training a custom BERT model or running a traditional machine-learning training pipeline if it is not.

The practical implementation should use a **pre-trained transformer-based Large Language Model through the Grok API**.

Grok is the primary AI engine responsible for the heavy natural-language analysis.

The architecture should therefore be presented as a modern implementation of NLP-based semantic resume screening using a pre-trained transformer-based language model.

TF-IDF and Cosine Similarity represent the classical NLP foundation for textual relevance and similarity, while the pre-trained transformer-based model provides deeper contextual and semantic understanding.

Do not introduce unnecessary Python model training, custom datasets, model fine-tuning, or local model infrastructure.

---

# 4. AI IMPLEMENTATION STRATEGY

Use the Grok API as the primary AI service.

The system must not train its own AI model.

The AI should receive structured information from the application, including the job description and candidate resume information, and return structured analysis.

The AI analysis should be deterministic enough for the same information to produce a sensible and consistent result.

Where the Grok API supports structured output or JSON responses, use structured output.

Do not depend on parsing unpredictable blocks of prose when structured JSON can be used.

A conceptual response should contain information such as:

```json
{
  "match_score": 87,
  "found_skills": [
    "React",
    "JavaScript",
    "TypeScript"
  ],
  "missing_skills": [
    "Next.js"
  ],
  "experience_match": "Strong",
  "education_match": "Good",
  "strengths": [
    "Strong frontend development experience"
  ],
  "weaknesses": [
    "Limited Next.js experience"
  ],
  "summary": "The candidate demonstrates strong alignment with the role..."
}
```

The exact schema may be improved where necessary, but it must remain structured, predictable, and easy to store in Supabase.

---

# 5. AI RESPONSIBILITIES

Grok should perform the heavy language understanding work.

It should be capable of:

### Resume Analysis

* Understand extracted resume text
* Identify candidate skills
* Identify education
* Identify work experience
* Identify relevant qualifications
* Identify relevant keywords
* Identify professional background
* Detect potentially relevant experience even where exact terminology differs

### Job Description Analysis

Analyze a company's job description and identify:

* Job title
* Required skills
* Preferred skills
* Experience requirements
* Education requirements
* Responsibilities
* Important qualifications
* Relevant keywords
* General candidate requirements

### Candidate Matching

Compare the candidate against the specific job.

The AI should determine:

* Skills that match
* Skills that are absent
* Relevant experience
* Experience gaps
* Education relevance
* Overall suitability
* Strengths
* Weaknesses
* Overall match score
* Short assessment

### Candidate Ranking

The system should use the resulting evaluation to help rank candidates for a particular job.

A candidate's score must belong to the specific application and job being evaluated.

A candidate applying to Job A must not inherit a score from Job B.

---

# 6. IMPORTANT AI INTEGRITY RULES

The AI must not invent qualifications, work experience, certifications, education, or skills that are not supported by the submitted resume.

If information cannot be found, mark it as unavailable or unknown rather than inventing it.

Do not allow the model to assume that a candidate possesses a skill merely because it is common in their job title.

The AI should distinguish between:

* Explicitly stated information
* Reasonable semantic relationships
* Information that is unavailable

The application should clearly identify AI-generated assessments as AI-assisted evaluations.

The final hiring decision belongs to the company.

---

# 7. DOCUMENT PROCESSING

Job seekers should be able to upload resumes in appropriate supported formats, particularly:

* PDF
* DOCX

The application should extract readable text from the uploaded document before sending relevant content to Grok.

The original uploaded file should be securely stored.

The extracted text should be associated with the candidate's resume/application.

The system should gracefully handle:

* Invalid files
* Unsupported formats
* Empty documents
* Corrupted documents
* Documents with little or no extractable text
* Oversized uploads
* AI API failures
* Processing failures

Do not allow an unusable resume to silently become a successful application.

---

# 8. USER ROLES

The system has exactly three primary user categories:

## A. SYSTEM ADMIN

The System Admin is the general administrator of the entire platform.

Responsibilities may include:

* Manage platform users
* Manage companies
* Manage job seekers
* Monitor jobs
* Monitor applications
* Manage problematic accounts
* View system-level activity
* Maintain platform integrity
* Manage or deactivate inappropriate content/accounts where necessary

The Admin should have system-level privileges but should not unnecessarily interfere with ordinary recruitment workflows.

---

# 9. COMPANY / RECRUITER ROLE

The previous concept of an individual recruiter must be replaced with a **company-based recruitment entity**.

A recruiter should not be represented primarily as a person's personal account.

The recruitment entity must be a company with its own profile.

A company profile should include appropriate information such as:

* Company name
* Company logo
* Company description
* Company email
* Phone number
* Website
* Location
* Industry/category where appropriate
* Other relevant professional company details

The company must have an internal unique identifier, preferably a UUID.

Do not use the company name as the database primary key.

Two companies could theoretically have similar or identical names, so identity must be based on a unique internal ID.

The company name is a display attribute.

---

# 10. COMPANY REGISTRATION AND PROFILE SETUP

During company registration or initial profile setup, provide an appropriate company onboarding process.

The company should be able to:

1. Create an account
2. Provide company name
3. Upload company logo
4. Provide company details
5. Complete company profile
6. Access company dashboard

The logo should be uploaded to Supabase Storage or an appropriate storage mechanism.

Validate uploaded logos appropriately.

The company logo should subsequently appear where company identity is displayed, including:

* Company profile
* Job listings where appropriate
* Job details
* Company dashboard
* Relevant application/recruitment screens

Do not display a generic avatar where the company has supplied a valid logo.

---

# 11. COMPANY JOB MANAGEMENT

Companies should be able to:

* Create jobs
* Edit their own jobs
* Publish jobs
* Unpublish jobs
* Close jobs
* View their own jobs
* View applicants for their own jobs
* Review candidate applications
* Review AI screening results
* Rank candidates
* Update application status

A job should contain appropriate information such as:

* Job ID
* Company ID
* Job title
* Description
* Required skills
* Preferred skills
* Experience requirements
* Education requirements
* Employment type where appropriate
* Location/work arrangement where appropriate
* Application deadline where applicable
* Job status
* Created date
* Updated date

Avoid collecting unnecessary information.

---

# 12. JOB SEEKER ROLE

Job seekers are individual users who are looking for employment.

A job seeker should be able to:

* Register
* Log in
* Manage personal profile
* Browse available jobs
* Search available jobs
* View job details
* Apply for a job
* Upload a CV/resume
* Submit relevant credentials/information
* View submitted applications
* Track application status
* View their own application history

A job seeker must never be able to create a job.

This restriction must be enforced at both:

1. UI level
2. Server/database authorization level

Do not merely hide the Create Job button.

A malicious user must not be able to bypass the restriction by manually calling an endpoint.

---

# 13. CRITICAL ROLE SEPARATION

The following rules are mandatory.

### Company

CAN:

* Create jobs
* Manage its own jobs
* View applications submitted to its jobs
* View applicant resumes belonging to its jobs
* View AI evaluations
* Rank candidates
* Process applications

CANNOT:

* Submit a job application as a company
* Upload a candidate resume as if they were the candidate
* View applications belonging to another company

### Job Seeker

CAN:

* Browse jobs
* View job details
* Apply to jobs
* Upload their own resume
* View their own applications
* Track their own application statuses

CANNOT:

* Create jobs
* Edit company jobs
* Access another candidate's application
* Access another candidate's resume
* View private company recruitment information

### System Admin

Has platform-wide administrative privileges according to the defined authorization policies.

---

# 14. CORRECT APPLICATION WORKFLOW

This is the central workflow of the system.

### Step 1: Company Creates Job

A company logs in and creates a job vacancy.

### Step 2: Company Publishes Job

The job becomes visible to job seekers.

### Step 3: Job Seeker Discovers Job

The job seeker browses/searches available jobs.

### Step 4: Job Seeker Views Job

The job seeker can see:

* Company name
* Company logo
* Job title
* Job description
* Requirements
* Skills
* Experience requirements
* Education requirements
* Other relevant job information

### Step 5: Job Seeker Applies

The job seeker clicks Apply.

The application should collect the required candidate information and resume.

### Step 6: Resume Upload

The job seeker uploads their CV/resume.

The CV belongs to the job seeker's application.

The company does not upload it.

### Step 7: Application Creation

Create exactly one application record for that submission.

The application should initially have:

**Pending**

status.

### Step 8: AI Processing

The system extracts the resume text and submits the relevant resume/job information to Grok.

### Step 9: AI Result

Grok returns:

* Match score
* Found skills
* Missing skills
* Experience assessment
* Education assessment
* Strengths
* Weaknesses
* Summary

### Step 10: Store AI Result

Store the analysis against the specific application.

AI analysis must not create duplicate application records.

### Step 11: Company Review

The company sees its applicants and their AI-assisted evaluations.

### Step 12: Candidate Ranking

Applicants can be ordered according to their match score and other relevant evaluation information.

### Step 13: Recruitment Decision

The company can process candidates through appropriate statuses.

---

# 15. APPLICATION STATUS

Use clear application states such as:

* Pending
* Reviewing
* Shortlisted
* Rejected
* Hired
* Withdrawn

The exact set can be adjusted if necessary, but status handling must be consistent throughout the system.

A job seeker submits an application as:

**Pending**

The company is responsible for progressing the application.

A job seeker must not be able to make themselves:

* Shortlisted
* Hired
* Rejected

The company should control recruitment decision statuses.

A job seeker may be allowed to withdraw their own application if this functionality is implemented.

---

# 16. APPLICATION DATA MODEL

An application should be a first-class database entity.

Conceptually:

```text
Application
├── id
├── job_id
├── company_id
├── job_seeker_id
├── resume_id
├── status
├── submitted_at
├── updated_at
└── ...
```

Do not duplicate applications unnecessarily.

One actual application submission must correspond to one application record.

Repeated AI processing must update the relevant analysis rather than create another application.

---

# 17. APPLICANT COUNT MUST BE ACCURATE

The number of applicants displayed for a job must come from actual application records associated with that job.

If one person has applied:

**Applicants: 1**

It must not display 23, 10, 50, or any other number unless that number represents actual applications.

Do not increment applicant counts because:

* AI analysis runs
* A candidate is viewed
* A page is refreshed
* An application is updated
* A resume is reprocessed
* A candidate is ranked
* A recruiter opens the job

The applicant count should be derived from the actual application relationship.

---

# 18. JOB DETAILS AND APPLICANT LIST

When a company opens a job's details, the system must retrieve applications belonging specifically to that job.

For example:

```text
Job ID
   ↓
Applications WHERE job_id = current_job_id
   ↓
Applicants
```

The page should not retrieve random candidates globally.

Each applicant should display relevant information such as:

* Candidate name
* Resume status
* Application status
* AI match score
* Relevant skills
* Application date
* Review status

Detailed information should only be accessible to authorized company users associated with the job.

---

# 19. JOB SEEKER DASHBOARD

The job seeker dashboard should be centered around employment search and applications.

It should NOT focus on jobs created by the job seeker because job seekers cannot create jobs.

Useful dashboard information may include:

* Number of applications
* Pending applications
* Applications under review
* Shortlisted applications
* Recent applications
* Application status

The central section should be:

**My Applications**

Each application should display:

* Job title
* Company name
* Company logo where appropriate
* Date applied
* Application status
* Relevant action such as View Application

The dashboard must retrieve records based on the authenticated job seeker's ID.

It must not query jobs created by the user.

---

# 20. COMPANY DASHBOARD

The company dashboard should provide a focused overview of recruitment activity.

Useful dynamic information includes:

* Active jobs
* Closed jobs
* Total applications
* Pending applications
* Candidates under review
* Shortlisted candidates

Include recent recruitment activity where genuinely useful.

Do not fill the dashboard with meaningless charts or fake statistics.

Every statistic must be calculated from real Supabase data.

---

# 21. CANDIDATE PROFILE / APPLICATION VIEW

When a company views an applicant, provide a detailed but organized candidate/application view.

It should include:

### Candidate Information

* Name
* Contact information where appropriate
* Professional information
* Education
* Experience

### Resume

* Resume filename
* Resume preview or download/view mechanism
* Extracted information

### AI Evaluation

* Match score
* Found skills
* Missing skills
* Experience evaluation
* Education evaluation
* Strengths
* Weaknesses
* AI-generated summary

### Application

* Job applied for
* Application date
* Current status

### Recruiter/Company Review

Where applicable:

* Internal notes
* Status update
* Candidate review

Do not expose private company notes to job seekers.

---

# 22. CANDIDATE RANKING

Candidate ranking must be specific to a particular job.

For example:

```text
Frontend Developer
│
├── Candidate A → 91%
├── Candidate B → 84%
├── Candidate C → 76%
└── Candidate D → 68%
```

Do not create a single global ranking of all job seekers.

A candidate may rank highly for one job and poorly for another.

Ranking should therefore be calculated within the context of:

**Job → Applications → AI Evaluations**

Use actual stored AI results.

Do not randomly generate scores.

Do not use hard-coded rankings.

---

# 23. TRANSPARENCY OF AI RESULTS

Do not display only:

**"87% Match"**

without context.

The company should be able to understand why the system reached the result.

Present supporting information such as:

* Matching skills
* Missing skills
* Relevant experience
* Education relevance
* Strengths
* Weaknesses
* Short assessment

The UI should communicate that the result is an AI-assisted evaluation.

Avoid making claims such as:

"AI has determined this is the best candidate."

Prefer language such as:

"AI Match Assessment"

or:

"AI-assisted candidate evaluation."

---

# 24. COMPANY-SPECIFIC DATA ISOLATION

A company must only be able to access its own recruitment data.

For example:

Company A:

```text
Company A
├── Job A1
├── Job A2
└── Applications for A1/A2
```

Company B:

```text
Company B
├── Job B1
└── Applications for B1
```

Company A must never be able to retrieve:

* Company B's jobs through private company endpoints
* Company B's applications
* Company B's candidate resumes
* Company B's internal notes
* Company B's private recruitment data

Use Supabase Row Level Security and server-side authorization to enforce this.

---

# 25. AUTHENTICATION

Use:

**Supabase Auth**

for authentication.

Support appropriate flows including:

* Company registration
* Job seeker registration
* Admin authentication
* Login
* Logout
* Forgot password
* Password reset
* Session persistence

The role should be associated securely with the authenticated user.

Do not trust a role supplied by the client.

---

# 26. FORGOT PASSWORD

Forgot Password must be genuinely functional.

The flow should be:

```text
Forgot Password
        ↓
Enter email
        ↓
Supabase sends reset email
        ↓
User opens reset link
        ↓
Reset password page
        ↓
New password
        ↓
Password updated
        ↓
User can log in
```

Configure the required Supabase redirect URL correctly.

Handle:

* Invalid email
* Unknown email
* Expired reset link
* Invalid token
* Password validation
* Successful reset

Do not build a fake Forgot Password page that does nothing.

---

# 27. SUPABASE DATABASE

Use Supabase as the primary database.

The schema should be relational and designed around actual ownership and relationships.

Logical entities should include at least the necessary structures for:

### Profiles / Users

Store authenticated user-related information and role.

### Companies

Store company-specific information.

### Jobs

Store job vacancies created by companies.

### Job Applications

Connect job seekers to jobs.

### Resumes

Store resume metadata and storage references.

### AI Analyses

Store AI-generated analysis associated with a particular application.

### Recruiter/Company Notes

If implemented, store private notes associated with candidates/applications.

Additional supporting entities may be introduced only where genuinely necessary.

---

# 28. IMPORTANT DATABASE RELATIONSHIPS

The essential relationship should be:

```text
User
 │
 ├── Job Seeker Profile
 │       │
 │       └── Applications
 │               │
 │               ├── Job
 │               │     │
 │               │     └── Company
 │               │
 │               ├── Resume
 │               │
 │               └── AI Analysis
 │
 └── Company User/Profile
         │
         └── Company
                │
                └── Jobs
                       │
                       └── Applications
```

The architecture should allow a company to be represented independently from the person who happens to manage the company account.

Do not make company name the primary identifier.

---

# 29. SUPABASE STORAGE

Use Supabase Storage for appropriate uploaded files.

Potential storage categories include:

* Company logos
* Job seeker resumes

Storage policies must prevent unauthorized users from accessing private candidate documents.

A company should only access resumes submitted to its own jobs.

A job seeker should only access their own resume files.

Public company logos may be handled differently if appropriate, but private candidate documents must remain protected.

---

# 30. ROW LEVEL SECURITY

Supabase RLS must be treated as a fundamental security layer.

Implement appropriate policies so that:

### Job Seekers

Can:

* Read published jobs
* Create their own applications
* Read their own applications
* Upload/read their own resume data

Cannot:

* Create jobs
* Modify jobs
* Read another user's applications
* Read another candidate's resume
* Access company-private information

### Companies

Can:

* Manage their own jobs
* Read applications submitted to their jobs
* Read resumes associated with applications to their jobs
* Read AI analyses for their applicants
* Update recruitment statuses for their own applications

Cannot:

* Modify another company's jobs
* Access another company's applications

### Admin

Has appropriate platform-wide administrative permissions.

Never rely only on frontend role checks.

---

# 31. SECURITY

Implement sensible security measures including:

* Server-side authorization
* Supabase RLS
* Secure API routes
* Environment variables for API keys
* Never expose the Grok API key to the browser
* Validate uploaded files
* Restrict file types
* Restrict file sizes
* Protect private resume files
* Validate user input
* Prevent unauthorized application manipulation
* Prevent cross-company data access
* Avoid trusting client-provided roles
* Avoid exposing unnecessary personal information

The Grok API key must remain server-side.

---

# 32. APPLICATION DUPLICATION RULE

A job seeker should not accidentally create multiple applications for the same job simply because:

* They refresh the page
* The AI runs again
* The company opens the application
* The resume is processed
* A request is retried

Consider enforcing a unique relationship such as:

**job_id + job_seeker_id**

if the intended business rule is one active application per job per job seeker.

If the application is withdrawn, the implementation may determine whether reapplication is permitted, but this must be deliberate rather than accidental.

---

# 33. JOB VISIBILITY

Only appropriate jobs should be visible to job seekers.

For example:

**Draft**
should remain private to the company.

**Published**
should be available for job seekers to discover.

**Closed**
should no longer accept new applications.

Do not allow job seekers to apply to unpublished or closed jobs.

These restrictions must be enforced server-side.

---

# 34. JOB SEARCH

Provide a practical job discovery experience.

Job seekers should be able to browse available jobs and search where useful.

Relevant filtering may include:

* Job title
* Skill
* Location
* Employment type
* Other meaningful job attributes

Do not overcomplicate the search interface.

The purpose is to help job seekers find relevant opportunities quickly.

---

# 35. APPLICATION VALIDATION

Before submitting an application:

Validate:

* Required personal information
* Required application fields
* Resume presence
* Resume format
* Resume size
* Job availability
* User authorization

Do not submit an incomplete application.

Show clear validation messages.

Do not use vague errors such as:

"Something went wrong."

Where possible, explain what happened and what the user should do.

---

# 36. AI PROCESSING STATES

AI processing must have clear states.

For example:

```text
Application Submitted
        ↓
Resume Processing
        ↓
AI Analysis
        ↓
Analysis Completed
```

If analysis fails:

```text
Analysis Failed
        ↓
Retry Analysis
```

The user should not be left staring at an indefinite loading screen.

Do not create duplicate analyses every time the retry button is pressed.

---

# 37. ERROR HANDLING

Implement realistic error handling for:

* Authentication failure
* Invalid credentials
* Expired sessions
* Unauthorized access
* Failed database requests
* Failed uploads
* Invalid resume files
* Empty resume documents
* AI API failures
* AI timeout
* Rate limits
* Network errors
* Invalid job
* Closed job
* Duplicate application
* Missing profile
* Missing company information

Use meaningful toast messages, inline validation, empty states, and error pages where appropriate.

---

# 38. REQUIRED APPLICATION PAGES

Use the Next.js App Router.

The exact folder organization can be determined by the implementation, but the application should provide appropriate routes for:

## Public

`/`

Landing page

`/jobs`

Public job discovery

`/jobs/[id]`

Job details

## Authentication

`/login`

`/signup`

`/forgot-password`

`/reset-password`

## Job Seeker

`/dashboard`

`/profile`

`/applications`

`/applications/[id]`

Potentially `/jobs/[id]/apply`

## Company

`/company/dashboard`

`/company/profile`

`/company/jobs`

`/company/jobs/create`

`/company/jobs/[id]`

`/company/jobs/[id]/applicants`

`/company/applications/[id]`

## Admin

`/admin/dashboard`

`/admin/users`

`/admin/companies`

`/admin/jobs`

`/admin/applications`

Additional pages should only be added when necessary.

---

# 39. LANDING PAGE

The landing page should clearly explain the product.

It should communicate:

* What the platform does
* How companies benefit
* How job seekers use it
* How AI-assisted screening works
* The value of intelligent candidate matching

The landing page should not look like a generic AI SaaS template.

Do not use fake statistics such as:

"10,000+ companies"

unless the system actually has that data.

Use authentic product-focused content.

---

# 40. JOB SEEKER EXPERIENCE

The job seeker experience should feel simple and direct.

A job seeker should be able to:

```text
Browse Jobs
     ↓
Select Job
     ↓
Read Requirements
     ↓
Apply
     ↓
Upload Resume
     ↓
Submit
     ↓
Application Pending
     ↓
Track Status
```

Do not make users navigate through unnecessary screens.

---

# 41. COMPANY EXPERIENCE

The company experience should focus on:

```text
Company Profile
      ↓
Create Job
      ↓
Publish Job
      ↓
Receive Applications
      ↓
AI Screening
      ↓
Review Candidates
      ↓
Rank Candidates
      ↓
Update Application Status
```

The company dashboard should make this workflow obvious.

---

# 42. ADMIN EXPERIENCE

The Admin dashboard should provide an appropriate system-level overview.

It may include real statistics such as:

* Total companies
* Total job seekers
* Published jobs
* Total applications

Only display statistics that are actually calculated from the database.

Admin functionality should be practical rather than overloaded with unnecessary analytics.

---

# 43. COMPANY LOGO AND BRANDING

Company identity is an important part of the revised system.

Where a job seeker sees a company job, show the company identity appropriately:

* Logo
* Company name
* Relevant company information

A job card should not look like an anonymous listing if the company has a verified profile.

The design should make it immediately clear which company owns a vacancy.

---

# 44. UI/UX DIRECTION

This is a major requirement.

The interface must look like a professionally designed recruitment platform.

It should feel:

* Modern
* Professional
* Clean
* Refined
* Elegant
* Trustworthy
* Human-designed
* Intuitive
* Mature
* Responsive

Do not make the interface look like it was generated from a generic AI dashboard template.

The visual quality should come from:

* Strong typography
* Good spacing
* Clear hierarchy
* Consistent alignment
* Carefully designed components
* Appropriate contrast
* Good information architecture
* Meaningful interaction patterns
* Consistent visual language

---

# 45. AVOID GENERIC AI DESIGN

Do not automatically use:

* Excessive gradients
* Glassmorphism
* Neon colours
* Glow effects
* Decorative blobs
* Excessive rounded cards
* Excessive shadows
* Floating cards everywhere
* Giant headings
* Excessive animations
* Random illustrations
* Excessive icons
* Excessive badges
* Excessive pills
* Random charts
* Fake statistics
* Generic SaaS sections
* Generic dashboard templates

Do not use a design trend simply because it is popular.

The design must fit a serious recruitment and candidate evaluation system.

---

# 46. CLASSIC BUT MODERN DESIGN

The visual direction should be:

**Simple, but not basic.**

**Modern, but not trend-dependent.**

**Professional, but not unnecessarily corporate.**

**Beautiful, but not decorative.**

**Detailed, but not cluttered.**

Do not try to make the product look futuristic.

Instead, make it look polished and credible.

---

# 47. COLOUR SYSTEM

Use a restrained professional colour palette.

Avoid colour overload.

Colour should have clear meaning.

Use the primary colour for:

* Important actions
* Active navigation
* Important interaction states

Use semantic colours for:

* Success
* Warning
* Error
* Information

Do not assign random colours to cards or sections.

The application should feel cohesive.

---

# 48. TYPOGRAPHY

Use a professional typography system.

Prioritize:

* Readability
* Hierarchy
* Appropriate font sizes
* Appropriate line heights
* Consistent heading styles
* Clear body text
* Good form labels

Do not use oversized typography merely to make screens appear impressive.

---

# 49. COMPONENT DESIGN

Create reusable components where appropriate.

Examples may include:

* Job cards
* Company identity sections
* Application status indicators
* Candidate score displays
* Resume sections
* Skill lists
* Candidate ranking rows
* Form fields
* Navigation
* Tables
* Empty states
* Loading states
* Confirmation dialogs

However, do not turn every small piece of the interface into an unnecessary card.

---

# 50. DASHBOARD DESIGN

Dashboards should prioritize information rather than decoration.

Do not create a dashboard containing:

* Ten statistics cards
* Three meaningless charts
* Random activity feeds
* Decorative graphs

unless those elements are actually useful.

For the company, prioritize:

1. Recruitment overview
2. Active jobs
3. Applications
4. Candidates requiring review

For the job seeker, prioritize:

1. Applications
2. Application statuses
3. Relevant available jobs

For Admin, prioritize:

1. Platform overview
2. Users
3. Companies
4. Jobs
5. Applications

---

# 51. CANDIDATE RANKING UI

Candidate ranking is one of the most important interfaces in the product.

It should be easy for a company to compare applicants.

A professional ranking table/list could display:

* Rank
* Candidate
* Match score
* Key matching skills
* Missing skills
* Experience match
* Application status
* Date applied
* Action

The design must not overwhelm the recruiter.

Allow the recruiter to open a candidate for deeper information.

---

# 52. AI SCORE PRESENTATION

The score should be visually understandable but not exaggerated.

For example:

**87% Match**

with supporting information.

Avoid giant circular progress charts unless they genuinely improve usability.

Do not use excessive animations around the score.

The score should communicate information, not serve as decoration.

---

# 53. EMPTY STATES

Implement meaningful empty states.

Examples:

### Company has no jobs

"Create your first job vacancy to start receiving applications."

### Job has no applicants

"No applications have been submitted for this position yet."

### Job seeker has no applications

"You haven't applied for any jobs yet."

Do not populate empty states with fake records.

---

# 54. LOADING STATES

Use appropriate loading indicators during:

* Authentication
* Page loading
* Job retrieval
* Application submission
* Resume upload
* Resume processing
* AI analysis
* Status updates

Do not make the entire page unusable when only one section is loading.

---

# 55. RESPONSIVE DESIGN

The application must work properly on:

* Desktop
* Laptop
* Tablet
* Mobile

Do not simply shrink desktop layouts.

Adapt:

* Navigation
* Tables
* Candidate lists
* Forms
* Job cards
* Application pages
* Company profile
* Resume views
* AI results

for smaller screens.

On mobile, tables may become stacked cards or horizontally scrollable where appropriate.

---

# 56. ACCESSIBILITY

Implement sensible accessibility practices.

Include:

* Semantic HTML
* Proper labels
* Keyboard navigation
* Focus states
* Accessible buttons
* Accessible forms
* Meaningful error messages
* Adequate contrast
* Alt text for company logos
* Accessible interactive controls

Do not rely exclusively on colour to communicate status.

---

# 57. RESPONSIBLE RECRUITMENT AI

Because the system deals with employment decisions, avoid presenting the AI as an autonomous hiring authority.

The platform is an:

**AI-assisted resume screening and candidate ranking system.**

It supports the company by organizing and evaluating candidate information.

It does not independently make the final hiring decision.

Avoid unnecessary inference about protected or sensitive personal characteristics.

Do not encourage the model to evaluate candidates based on irrelevant personal attributes.

Focus evaluation on job-related information such as:

* Skills
* Experience
* Education
* Qualifications
* Job requirements
* Relevant professional evidence

---

# 58. PERFORMANCE

The application should be reasonably efficient.

Use:

* Server-side data retrieval where appropriate
* Efficient database queries
* Proper indexes
* Pagination for large candidate/application lists
* Appropriate caching where useful
* Optimized images
* Lazy loading where appropriate

Do not send enormous unnecessary datasets to the browser.

Do not send an entire company's candidate database to the client when only a paginated list is required.

---

# 59. GROK API PERFORMANCE AND COST CONTROL

Do not call the AI API unnecessarily.

Avoid repeated AI calls caused by:

* Component re-renders
* Page refreshes
* Duplicate submissions
* Opening a candidate profile repeatedly

Store completed AI analysis in Supabase.

If the same application has already been analyzed and no re-analysis is required, retrieve the stored result rather than automatically calling Grok again.

Provide an intentional mechanism for re-analysis where necessary.

The Grok API key must remain server-side.

---

# 60. AI PROMPT ENGINEERING

Create a carefully designed internal AI prompt for resume evaluation.

The prompt should instruct Grok to:

* Analyze only the provided information
* Avoid fabricating candidate information
* Compare the candidate against the job requirements
* Identify explicit and semantically relevant skills
* Distinguish required and preferred skills
* Evaluate experience relevance
* Evaluate education relevance
* Identify missing requirements
* Produce a justified match score
* Return structured output
* Provide a concise assessment

The AI should not simply produce a high score because a resume contains many words.

The analysis should be based on job relevance.

---

# 61. DATA FLOW

The complete technical data flow should approximately follow:

```text
Job Seeker
    ↓
Upload Resume
    ↓
Supabase Storage
    ↓
Resume Text Extraction
    ↓
Application Created
    ↓
Job + Resume Data
    ↓
Next.js Server/API
    ↓
Grok API
    ↓
Structured AI Analysis
    ↓
Supabase AI Analysis Record
    ↓
Company Dashboard
    ↓
Candidate Ranking
```

Do not expose sensitive API credentials to the frontend.

---

# 62. TECHNOLOGY STACK

Use the established technology direction:

### Frontend / Full-stack Framework

**Next.js**

Use the App Router.

### Database

**Supabase PostgreSQL**

### Authentication

**Supabase Auth**

### File Storage

**Supabase Storage**

### AI

**Grok API**

### Styling

Use a modern utility-first styling approach already appropriate to the Next.js project.

Do not introduce unnecessary UI libraries simply to make the project appear sophisticated.

Do not use Shadcn UI unless explicitly required later.

### Language

Prefer TypeScript throughout the application.

---

# 63. CODE QUALITY

Write maintainable, professional code.

Use:

* Strong TypeScript types
* Clear naming
* Reusable components
* Proper server/client separation
* Sensible folder organization
* Validation schemas
* Centralized API/service logic
* Proper error handling
* Environment configuration
* Avoid duplicated logic

Do not create enormous components containing unrelated functionality.

Do not overengineer simple features.

---

# 64. PROJECT STRUCTURE

Use a sensible Next.js App Router structure.

A conceptual structure may look like:

```text
src/
├── app/
│   ├── page.tsx
│   ├── login/
│   ├── signup/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── jobs/
│   │   └── [id]/
│   ├── dashboard/
│   ├── applications/
│   ├── company/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── jobs/
│   │   ├── applications/
│   │   └── candidates/
│   └── admin/
│       ├── dashboard/
│       ├── users/
│       ├── companies/
│       ├── jobs/
│       └── applications/
│
├── components/
│   ├── ui/
│   ├── jobs/
│   ├── applications/
│   ├── candidates/
│   ├── company/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── ai/
│   ├── resume/
│   └── validation/
│
├── services/
│   ├── ai.service.ts
│   ├── job.service.ts
│   ├── application.service.ts
│   ├── company.service.ts
│   └── resume.service.ts
│
├── types/
│
└── ...
```

The exact structure can be adjusted based on the final implementation, but maintain a clear separation of concerns.

---

# 65. DO NOT BUILD A GENERIC CRUD APPLICATION

Although the system contains CRUD operations, the project must not feel like:

"Create → Read → Update → Delete."

The central experience is:

**Recruitment intelligence.**

The software should demonstrate:

* Job discovery
* Candidate application
* Resume processing
* AI analysis
* Candidate comparison
* Candidate ranking
* Recruitment decision support

CRUD is infrastructure, not the product experience.

---

# 66. FEATURES THAT MUST NOT BE INVENTED

Do not automatically add unrelated functionality such as:

* Social networking
* Messaging
* Chat
* Community forums
* Subscription billing
* Payment systems
* Referral programs
* Gamification
* Complex HR payroll
* Attendance
* Employee management
* Full HR management
* Video interviews
* Calendar systems
* Unnecessary AI chatbot
* AI career coach
* Unnecessary notification centre
* Unnecessary advanced analytics

Only introduce additional functionality if it is directly required for an already-defined workflow.

---

# 67. NO FAKE DATA

During development, temporary seed data may be used for testing, but the actual application must rely on the database.

Do not permanently populate dashboards with fake:

* Applicants
* Companies
* Jobs
* Scores
* Notifications
* Statistics
* Analytics

If there is no data, show a proper empty state.

---

# 68. NO FAKE BUTTONS

Every visible action must either:

1. Perform the intended operation, or
2. Be clearly disabled because the operation is currently unavailable.

Do not create decorative buttons.

---

# 69. NO CLIENT-SIDE SECURITY PRETENDING TO BE SECURITY

A hidden button is not authorization.

A disabled input is not authorization.

A frontend role check is not authorization.

Enforce permissions through:

* Server-side checks
* Supabase RLS
* Database constraints
* Secure API routes

This is particularly important for:

* Job creation
* Application access
* Resume access
* Company data
* Application status updates
* Admin operations

---

# 70. CRITICAL BUSINESS RULES

Implement these rules exactly:

### Rule 1

Only companies can create jobs.

### Rule 2

Job seekers cannot create jobs.

### Rule 3

Only job seekers submit job applications.

### Rule 4

Job seekers upload their own resumes during application.

### Rule 5

Companies do not upload candidate resumes.

### Rule 6

One application belongs to one job seeker and one specific job.

### Rule 7

AI analysis belongs to a specific application.

### Rule 8

AI analysis must not create duplicate applications.

### Rule 9

Applicant count must be calculated from actual applications.

### Rule 10

Companies can only access their own jobs and applicants.

### Rule 11

Job seekers can only access their own applications and resumes.

### Rule 12

Only authorized companies can change recruitment statuses.

### Rule 13

Job seekers cannot make themselves shortlisted or hired.

### Rule 14

Draft/closed jobs must not accept applications.

### Rule 15

Grok API credentials must remain private.

### Rule 16

AI must not fabricate candidate qualifications.

### Rule 17

AI results are decision-support information, not autonomous hiring decisions.

---

# 71. TESTING REQUIREMENTS

Before considering the system complete, test the following scenarios.

### Authentication

* Company signup
* Job seeker signup
* Login
* Logout
* Forgot password
* Password reset
* Invalid login
* Unauthorized route access

### Company

* Create company profile
* Upload company logo
* Edit company profile
* Create job
* Edit job
* Publish job
* Close job
* View applications
* View candidate
* View AI analysis
* Update application status

### Job Seeker

* Create profile
* Browse jobs
* View job
* Apply
* Upload resume
* Submit application
* View application
* Track status
* Prevent job creation

### AI

* Resume extraction
* Job analysis
* Grok request
* Structured response
* Score storage
* Skills storage
* Missing skills
* AI summary
* AI failure
* Retry
* Prevent duplicate analysis

### Security

Test that:

* Job seekers cannot create jobs through direct API requests
* Company A cannot access Company B's applications
* Company A cannot access Company B's resumes
* Job seekers cannot access other candidates
* Job seekers cannot modify their application status to hired
* Unauthenticated users cannot access protected dashboards

### Applicant Count

Test:

1 applicant → display 1.

2 applicants → display 2.

Repeated AI analysis → count remains unchanged.

Refreshing page → count remains unchanged.

Viewing candidate → count remains unchanged.

---

# 72. FINAL QUALITY STANDARD

Do not consider the application complete merely because:

* Pages exist
* Routes work
* Forms render
* The dashboard opens
* The API responds

The final system must demonstrate:

**Functional correctness**

**Logical data relationships**

**Correct authorization**

**Reliable AI integration**

**Professional UI/UX**

**Responsive design**

**Meaningful error handling**

**Accurate dynamic data**

**Secure file handling**

**Real recruitment workflow**

**Clear AI-assisted candidate evaluation**

---

# 73. FINAL DESIGN PHILOSOPHY

The finished application should feel like a real recruitment technology product designed by an experienced product team.

It should communicate:

**Trust**
**Professionalism**
**Clarity**
**Efficiency**
**Intelligence**
**Human oversight**

Do not make it visually noisy.

Do not make it look like an AI experiment.

Do not make it look like a generic student dashboard.

Do not make it look like a collection of cards generated by an AI coding tool.

Every screen should answer:

> What does this user need to know here?

and:

> What action should this user be able to take here?

Design around those questions.

---

# 74. MOST IMPORTANT IMPLEMENTATION PRINCIPLE

Do not blindly preserve flawed logic from any previous version of this project.

This version is being treated as a clean implementation based on the latest requirements.

The corrected conceptual model is:

```text
                    SYSTEM ADMIN
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
      COMPANIES                    JOB SEEKERS
          │                             │
          │ creates                     │
          ▼                             │
        JOBS                            │
          │                             │
          │ receives applications       │
          └──────────────┐              │
                         ▼              │
                    APPLICATION ◄───────┘
                         │
                         │ contains
                         ▼
                       RESUME
                         │
                         ▼
                    GROK AI
                         │
                         ▼
                  AI ANALYSIS
                         │
                         ▼
                MATCH SCORE / RANK
                         │
                         ▼
                     COMPANY
                         │
                         ▼
               RECRUITMENT DECISION
```

This relationship must remain consistent throughout the application.

---

# 75. BUILD ORDER

Implement the project in a logical sequence.

### Phase 1

Project foundation, configuration, Supabase integration, environment variables, database schema, authentication.

### Phase 2

Three-role authorization and protected layouts.

### Phase 3

Company registration, company profile, logo upload, and company dashboard.

### Phase 4

Job creation, editing, publishing, closing, and job discovery.

### Phase 5

Job seeker profile and application workflow.

### Phase 6

Resume upload and secure storage.

### Phase 7

Resume text extraction.

### Phase 8

Grok AI integration and structured AI analysis.

### Phase 9

AI analysis storage and candidate ranking.

### Phase 10

Company applicant management and recruitment status workflow.

### Phase 11

Admin functionality.

### Phase 12

Responsive UI refinement, accessibility, validation, error handling, performance optimization, security review, and end-to-end testing.

Do not build every page first and postpone functionality until the end.

Build each workflow end-to-end.

---

# 76. DEVELOPMENT MINDSET

You are not merely producing screens.

You are building a complete working system.

Whenever you implement a feature, consider:

* Database
* Authentication
* Authorization
* Server logic
* Validation
* Error handling
* UI
* Loading state
* Empty state
* Success state
* Mobile behaviour
* Security
* Data integrity

A feature is not complete until the entire workflow works.

---

# 77. FINAL INSTRUCTION TO THE CODING AGENT

Build the system described above as a coherent, fully functional, professional web application.

Do not ask the developer to repeatedly redefine the requirements.

Use the specification above as the source of truth.

Where small implementation details are not explicitly specified, make sensible professional engineering decisions that preserve the project's purpose and scope.

Do not invent major features.

Do not replace the company-based recruitment model with individual recruiters.

Do not allow job seekers to create jobs.

Do not allow companies to upload candidate resumes.

Do not fabricate applicant counts.

Do not create duplicate applications.

Do not fake AI functionality.

Do not expose API keys.

Do not use hard-coded production data.

Do not pretend that a frontend restriction is sufficient authorization.

Do not train a custom AI model.

Use the **Grok API as the primary AI engine** and leverage its pre-trained language understanding for resume and job analysis.

Maintain the academic positioning of the project around **NLP, TF-IDF, Cosine Similarity, and BERT-based semantic understanding**, while keeping the practical implementation honest about its use of a pre-trained transformer-based LLM.

Most importantly, produce a system that looks and behaves like a **real, carefully engineered recruitment platform**, not a generic AI-generated website.

The final result must be:

**Functional.**
**Secure.**
**Professional.**
**Responsive.**
**Intuitive.**
**Data-driven.**
**AI-assisted.**
**Academically defensible.**
**Visually refined.**
**Focused on the actual recruitment problem.**
