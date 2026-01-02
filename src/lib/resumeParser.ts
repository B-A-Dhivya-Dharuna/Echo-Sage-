import { ResumeInfo } from './types';

export function parseResumeText(text: string): ResumeInfo {
  const lines = text.split('\n').map(line => line.trim());
  
  // Extract skills
  const skills: string[] = [];
  const skillSectionPatterns = [
    /skills?[:\s]*([^\n]+)/gi,
    /technologies?[:\s]*([^\n]+)/gi,
    /technical\s+skills?[:\s]*([^\n]+)/gi
  ];

  lines.forEach(line => {
    skillSectionPatterns.forEach(pattern => {
      const match = line.match(pattern);
      if (match && match[1]) {
        const extracted = match[1]
          .split(/[,;\/|]/)
          .map(s => s.trim())
          .filter(s => s.length > 2 && s.length < 30);
        skills.push(...extracted);
      }
    });
  });

  // Extract tools/technologies
  const techKeywords = ['AWS', 'Azure', 'Docker', 'Kubernetes', 'React', 'Angular', 'Vue', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'MongoDB', 'PostgreSQL', 'Git', 'Jira', 'Slack'];
  const tools = techKeywords.filter(tech => 
    text.toLowerCase().includes(tech.toLowerCase())
  );

  // Extract experience keywords
  const expKeywords: string[] = [];
  const expPatterns = [
    /(\d+\+?\s*years?\s+(?:of\s+)?experience)/gi,
    /(managed|led|developed|implemented|created|achieved|built|designed)\s+[^\n]+/gi
  ];

  expPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      expKeywords.push(...matches.map(m => m.trim()));
    }
  });

  // Extract sections
  const sectionHeaders = ['experience', 'education', 'skills', 'projects', 'certifications', 'summary'];
  const sections = sectionHeaders.filter(header =>
    text.toLowerCase().includes(header)
  );

  // Check for contact info
  const hasContactInfo = /\b[\w._%+-]+@[\w.-]+\.[A-Z]{2,}\b|\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/gi.test(text);

  // Extract general keywords
  const keywords = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4)
    .slice(0, 20);

  return {
    skills: [...new Set(skills)].slice(0, 10),
    tools: [...new Set(tools)],
    experienceKeywords: [...new Set(expKeywords)],
    keywords: [...new Set(keywords)],
    sections,
    hasContactInfo
  };
}