import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ExplanationBoxProps {
  explanation: string[];
}

export function ExplanationBox({ explanation }: ExplanationBoxProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Analysis Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {explanation.map((point, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-slate-400 mt-1">•</span>
              <span className="text-slate-700">{point}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}