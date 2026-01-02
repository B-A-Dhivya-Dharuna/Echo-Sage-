import { JDInfo } from './types';

export function extractJDInfo(text: string): JDInfo {
  const lines = text.split('\n').map(line => line.trim());
  
  // Extract skills - look for common patterns
  const skills: string[] = [];
  const skillPatterns = [
    /(?:skills?|technologies?|requirements|qualifications)[:\s]*([^\n]+)/gi,
    /(?:proficient in|experience with|knowledge of)\s+([^\n]+)/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*(?:,|\n|and)/g
  ];

  lines.forEach(line => {
    skillPatterns.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          // For patterns with capture groups, use the captured group
          // For patterns without, use the full match
          const textToExtract = match.includes(':') || match.includes('in') || match.includes('with') || match.includes('of')
            ? match.replace(/(?:skills?|technologies?|requirements|qualifications)[:\s]*/gi, '')
                     .replace(/(?:proficient in|experience with|knowledge of)\s+/gi, '')
            : match;
          
          const extracted = textToExtract
            .split(/[,;\/]/)
            .map(s => s.trim())
            .filter(s => s.length > 2 && s.length < 30);
          skills.push(...extracted);
        });
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
    /(\d+\+?\s*years?)/gi,
    /(managed|led|developed|implemented|created|achieved|built|designed)\s+[^\n]+/gi
  ];

  expPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      expKeywords.push(...matches.map(m => m.trim()));
    }
  });

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
    keywords: [...new Set(keywords)]
  };
}