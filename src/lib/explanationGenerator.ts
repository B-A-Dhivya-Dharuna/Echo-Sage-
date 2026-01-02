import { JDInfo, ResumeInfo, ATSScore } from './types';

export function generateExplanation(
  jdInfo: JDInfo,
  resumeInfo: ResumeInfo,
  score: ATSScore
): string[] {
  const explanation: string[] = [];

  // Skill match explanation
  if (score.matchedSkills.length > 0) {
    explanation.push(
      `Your resume matches ${score.matchedSkills.length}/${jdInfo.skills.length} required skills from the job description.`
    );
  }

  if (score.missingSkills.length > 0) {
    explanation.push(
      `Missing key skills: ${score.missingSkills.slice(0, 3).join(', ')}. Consider adding these if you have experience with them.`
    );
  }

  // Experience relevance
  if (score.breakdown.experienceRelevance >= 20) {
    explanation.push(
      'Strong experience alignment detected - your resume contains relevant action verbs and experience indicators.'
    );
  } else if (score.breakdown.experienceRelevance >= 10) {
    explanation.push(
      'Moderate experience alignment - consider adding more specific achievements and quantifiable results.'
    );
  } else {
    explanation.push(
      'Limited experience keywords found - strengthen your resume with action verbs and specific accomplishments.'
    );
  }

  // Keyword alignment
  if (score.breakdown.keywordAlignment >= 12) {
    explanation.push(
      'Excellent keyword alignment - your resume uses terminology that matches the job description.'
    );
  } else if (score.breakdown.keywordAlignment >= 7) {
    explanation.push(
      'Good keyword alignment - some terms match, but consider mirroring more language from the job description.'
    );
  }

  // Tools match
  if (score.breakdown.toolsMatch >= 8) {
    explanation.push(
      'Strong technology stack match - you have most of the required tools and technologies.'
    );
  } else if (jdInfo.tools.length > 0) {
    explanation.push(
      `Technology gap detected - job requires ${jdInfo.tools.length} tools/technologies, ensure you highlight relevant experience.`
    );
  }

  // Structure feedback
  if (!resumeInfo.hasContactInfo) {
    explanation.push(
      'Add clear contact information (email, phone) to your resume header.'
    );
  }

  if (resumeInfo.sections.length < 3) {
    explanation.push(
      'Consider adding standard sections: Experience, Skills, and Education to improve structure.'
    );
  }

  return explanation;
}