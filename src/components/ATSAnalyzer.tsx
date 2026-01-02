import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ResumeUpload } from './ResumeUpload';
import { ScoreDisplay } from './ScoreDisplay';
import { SkillList } from './SkillList';
import { ExplanationBox } from './ExplanationBox';
import { parseResumeText } from '../lib/resumeParser';
import { extractJDInfo } from '../lib/jdExtractor';
import { calculateATSScore } from '../lib/atsScoring';
import { generateExplanation } from '../lib/explanationGenerator';
import { Search, FileText, Users } from 'lucide-react';

// Simple Tabs component since we're having import issues
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { activeTab, setActiveTab } as any);
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex space-x-1 p-1 bg-slate-100 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = (React.useContext(TabsContext) as any) || {};
  
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        activeTab === value
          ? 'bg-white text-slate-900 shadow-sm'
          : 'text-slate-600 hover:text-slate-900'
      } ${className}`}
      onClick={() => setActiveTab?.(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { activeTab } = (React.useContext(TabsContext) as any) || {};
  
  if (activeTab !== value) return null;
  
  return (
    <div className={className}>
      {children}
    </div>
  );
}

const TabsContext = React.createContext<{ activeTab: string; setActiveTab: (tab: string) => void } | null>(null);

interface AnalysisResult {
  score: number;
  breakdown: {
    skillMatch: number;
    experienceRelevance: number;
    keywordAlignment: number;
    toolsMatch: number;
    structure: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string[];
}

export function ATSAnalyzer() {
  const [jdText, setJdText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [recruiterResults, setRecruiterResults] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('jobseeker');

  const handleResumeSubmit = (text: string, filename?: string) => {
    if (filename && !text) {
      setResumeText('');
      return;
    }
    setResumeText(text);
  };

  const analyzeResume = async () => {
    if (!jdText || !resumeText) return;

    setIsAnalyzing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const jdInfo = extractJDInfo(jdText);
    const resumeInfo = parseResumeText(resumeText);
    const score = calculateATSScore(jdInfo, resumeInfo);
    const explanation = generateExplanation(jdInfo, resumeInfo, score);

    setResults({
      score: score.total,
      breakdown: score.breakdown,
      matchedSkills: score.matchedSkills,
      missingSkills: score.missingSkills,
      explanation
    });

    setIsAnalyzing(false);
  };

  const handleRecruiterSubmit = async (data: string) => {
    if (!jdText || !data) return;

    setIsAnalyzing(true);
    
    const resumeData = JSON.parse(data);
    const jdInfo = extractJDInfo(jdText);
    
    const results = await Promise.all(
      resumeData.map(async (resume: any) => {
        if (!resume.text) {
          return {
            filename: resume.filename,
            score: 0,
            breakdown: { skillMatch: 0, experienceRelevance: 0, keywordAlignment: 0, toolsMatch: 0, structure: 0 },
            matchedSkills: [],
            missingSkills: jdInfo.skills,
            explanation: ['No resume text provided. Please paste the resume content.']
          };
        }

        const resumeInfo = parseResumeText(resume.text);
        const score = calculateATSScore(jdInfo, resumeInfo);
        const explanation = generateExplanation(jdInfo, resumeInfo, score);

        return {
          filename: resume.filename,
          score: score.total,
          breakdown: score.breakdown,
          matchedSkills: score.matchedSkills,
          missingSkills: score.missingSkills,
          explanation
        };
      })
    );

    results.sort((a, b) => b.score - a.score);
    setRecruiterResults(results);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Echo Sage AI</h1>
            <p className="text-lg text-slate-600">Professional ATS Resume Analysis Tool</p>
          </div>

          <Tabs defaultValue="jobseeker" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="jobseeker" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Job Seeker</span>
              </TabsTrigger>
              <TabsTrigger value="recruiter" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Recruiter</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobseeker" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Job Description</span>
                  </CardTitle>
                  <CardDescription>
                    Paste the job description you're applying for
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the complete job description here..."
                    className="min-h-[200px]"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                  />
                </CardContent>
              </Card>

              <ResumeUpload 
                mode="single" 
                onTextSubmit={handleResumeSubmit}
              />

              {resumeText && (
                <Button 
                  onClick={analyzeResume}
                  className="w-full"
                  disabled={!jdText || isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                </Button>
              )}

              {results && (
                <div className="space-y-6">
                  <ScoreDisplay score={results.score} />
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Skills Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SkillList
                        matchedSkills={results.matchedSkills}
                        missingSkills={results.missingSkills}
                      />
                    </CardContent>
                  </Card>

                  <ExplanationBox explanation={results.explanation} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="recruiter" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Job Description</span>
                  </CardTitle>
                  <CardDescription>
                    Paste the job description to rank resumes against
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Paste the complete job description here..."
                    className="min-h-[200px]"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                  />
                </CardContent>
              </Card>

              <ResumeUpload 
                mode="multiple" 
                onTextSubmit={handleRecruiterSubmit}
              />

              {recruiterResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Resume Rankings</CardTitle>
                    <CardDescription>
                      Resumes ranked by ATS score (highest first)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recruiterResults.map((result, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">{result.filename}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-blue-600">
                                {result.score.toFixed(1)}
                              </span>
                              <span className="text-sm text-slate-500">
                                Rank #{index + 1}
                              </span>
                            </div>
                          </div>
                          <SkillList
                            matchedSkills={result.matchedSkills}
                            missingSkills={result.missingSkills}
                          />
                          <div className="mt-3 text-sm text-slate-600">
                            {result.explanation.slice(0, 2).map((exp: string, i: number) => (
                              <div key={i}>• {exp}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </TabsContext.Provider>
    </div>
  );
}