import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface ResumeTableProps {
  results: { name: string; result: any }[];
}

export function ResumeTable({ results }: ResumeTableProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Resume Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((item, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-slate-600">Rank #{index + 1}</p>
                </div>
                <Badge className={getScoreColor(item.result.score)}>
                  {item.result.score.toFixed(1)}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-green-700 mb-1">Strengths:</p>
                  <ul className="space-y-1">
                    {item.result.matchedSkills.slice(0, 3).map((skill: string, i: number) => (
                      <li key={i} className="text-slate-600">• {skill}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-red-700 mb-1">Missing:</p>
                  <ul className="space-y-1">
                    {item.result.missingSkills.slice(0, 3).map((skill: string, i: number) => (
                      <li key={i} className="text-slate-600">• {skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}