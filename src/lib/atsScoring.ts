import { JDInfo, ResumeInfo } from './types';

export interface ATSScore {
  total: number;
  matchedSkills: string[];
  missingSkills: string[];
  breakdown: {
    skillMatch: number;
    experienceRelevance: number;
    keywordAlignment: number;
    toolsMatch: number;
    structure: number;
  };
}

export function calculateATSScore(jdInfo: JDInfo, resumeInfo: ResumeInfo): ATSScore {
  // Skill Match (40%)
  const matchedSkills = jdInfo.skills.filter(skill => 
    resumeInfo.skills.some(rSkill => 
      rSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(rSkill.toLowerCase())
    )
  );
  const missingSkills = jdInfo.skills.filter(skill => !matchedSkills.includes(skill));
  const skillMatchScore = jdInfo.skills.length > 0 
    ? (matchedSkills.length / jdInfo.skills.length) * 40 
    : 0;

  // Experience Relevance (25%)
  const expKeywords = ['managed', 'led', 'developed', 'implemented', 'created', 'achieved'];
  const jdExpKeywords = jdInfo.experienceKeywords.filter(kw => 
    expKeywords.some(exp => kw.toLowerCase().includes(exp))
  );
  const resumeExpKeywords = resumeInfo.experienceKeywords.filter(kw => 
    expKeywords.some(exp => kw.toLowerCase().includes(exp))
  );
  const expRelevanceScore = jdExpKeywords.length > 0
    ? (resumeExpKeywords.length / Math.max(jdExpKeywords.length, 1)) * 25
    : 12.5; // Default if no clear exp keywords

  // Keyword Alignment (15%)
  const exactMatches = jdInfo.keywords.filter(keyword =>
    resumeInfo.keywords.some(rKeyword => 
      rKeyword.toLowerCase() === keyword.toLowerCase()
    )
  );
  const keywordAlignmentScore = jdInfo.keywords.length > 0
    ? (exactMatches.length / jdInfo.keywords.length) * 15
    : 7.5;

  // Tools Match (10%)
  const matchedTools = jdInfo.tools.filter(tool =>
    resumeInfo.tools.some(rTool => 
      rTool.toLowerCase().includes(tool.toLowerCase()) ||
      tool.toLowerCase().includes(rTool.toLowerCase())
    )
  );
  const toolsMatchScore = jdInfo.tools.length > 0
    ? (matchedTools.length / jdInfo.tools.length) * 10
    : 5;

  // Structure (10%)
  const hasSections = resumeInfo.sections.length >= 3;
  const hasContact = resumeInfo.hasContactInfo;
  const structureScore = (hasSections ? 5 : 0) + (hasContact ? 5 : 0);

  const total = skillMatchScore + expRelevanceScore + keywordAlignmentScore + toolsMatchScore + structureScore;

  return {
    total: Math.min(total, 100),
    matchedSkills,
    missingSkills,
    breakdown: {
      skillMatch: skillMatchScore,
      experienceRelevance: expRelevanceScore,
      keywordAlignment: keywordAlignmentScore,
      toolsMatch: toolsMatchScore,
      structure: structureScore
    }
  };
}