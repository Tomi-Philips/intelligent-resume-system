import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription, requiredSkills } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Missing required text' }, { status: 400 });
    }

    // TODO: In Phase 6, we will connect to an actual LLM (OpenAI / HuggingFace)
    // The prompt structure would look like:
    /*
      const prompt = `
        You are an expert technical recruiter. Analyze the following resume against the job description.
        Extract found skills, missing skills, provide a summary, and give a match score (0-100).
        
        Job Description: ${jobDescription}
        Required Skills: ${requiredSkills.join(', ')}
        Resume: ${resumeText}
        
        Return ONLY valid JSON in this format:
        {
          "score": 85,
          "found_skills": ["React", "TypeScript"],
          "missing_skills": ["Node.js"],
          "summary": "Strong candidate with...",
          "recommendation": "Strong Hire"
        }
      `;
    */

    // MOCK RESPONSE FOR NOW
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    return NextResponse.json({
      score: Math.floor(Math.random() * (100 - 40 + 1) + 40), // Random 40-100
      found_skills: requiredSkills.slice(0, 2),
      missing_skills: requiredSkills.slice(2),
      summary: "This is a mocked AI evaluation. The candidate shows some promise but needs more review.",
      recommendation: "Potential Hire"
    });

  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
