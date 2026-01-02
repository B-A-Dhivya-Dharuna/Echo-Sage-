export interface JDInfo {
  skills: string[];
  tools: string[];
  experienceKeywords: string[];
  keywords: string[];
}

export interface ResumeInfo {
  skills: string[];
  tools: string[];
  experienceKeywords: string[];
  keywords: string[];
  sections: string[];
  hasContactInfo: boolean;
}

export interface ATSScore {
  matchedSkills: string[];
  missingSkills: string[];
  breakdown: {
    experienceRelevance: number;
    keywordAlignment: number;
    toolsMatch: number;
  };
}