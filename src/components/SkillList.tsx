import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SkillListProps {
  matchedSkills: string[];
  missingSkills: string[];
}

export function SkillList({ matchedSkills, missingSkills }: SkillListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Skills Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium text-green-700 mb-2">✅ Matched Skills ({matchedSkills.length})</h4>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-red-700 mb-2">❌ Missing Skills ({missingSkills.length})</h4>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}