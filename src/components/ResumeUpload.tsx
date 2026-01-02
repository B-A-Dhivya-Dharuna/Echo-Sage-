import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface ResumeUploadProps {
  onTextSubmit: (text: string, filename?: string) => void;
  mode: 'single' | 'multiple';
}

export function ResumeUpload({ onTextSubmit, mode }: ResumeUploadProps) {
  const [resumeText, setResumeText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pdfWarning, setPdfWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Check for PDF files
    const hasPdf = newFiles.some(file => file.type === 'application/pdf');
    if (hasPdf) {
      setPdfWarning(true);
    }

    if (mode === 'single') {
      // For single mode, try to read the first file
      const file = newFiles[0];
      
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
        onTextSubmit(text, file.name);
      } else if (file.type === 'application/pdf') {
        // For PDF, show instruction to paste text
        setResumeText('');
        onTextSubmit('', file.name);
      } else {
        // For other file types, show instruction
        setResumeText('');
        onTextSubmit('', file.name);
      }
    } else {
      // For multiple mode, store files
      setUploadedFiles(prev => [...prev.slice(0, 4), ...newFiles].slice(0, 5));
    }
  };

  const handleTextSubmit = () => {
    if (resumeText.trim()) {
      onTextSubmit(resumeText);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700 mb-1">
              {mode === 'single' ? 'Upload Resume' : 'Upload Resumes (Max 5)'}
            </p>
            <p className="text-xs text-slate-500">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Supports: PDF, TXT, DOCX
            </p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt,.docx,.doc,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
              multiple={mode === 'multiple'}
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>

          {/* PDF Warning */}
          {pdfWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    PDF Files Detected
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    For PDF files, please copy and paste the resume text below. 
                    Direct PDF parsing requires server-side processing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Text Input Area */}
          {mode === 'single' && (
            <div className="space-y-2">
              <Label htmlFor="resume-text" className="text-sm font-medium">
                Or Paste Resume Text
              </Label>
              <textarea
                id="resume-text"
                className="w-full min-h-[200px] p-3 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <Button 
                onClick={handleTextSubmit}
                className="w-full"
                disabled={!resumeText.trim()}
              >
                Analyze Resume
              </Button>
            </div>
          )}

          {/* Multiple Files Display */}
          {mode === 'multiple' && uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Uploaded Files</Label>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 rounded">
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span className="text-sm text-slate-700 flex-1">{file.name}</span>
                    <span className="text-xs text-slate-500">
                      {file.type === 'application/pdf' ? '(PDF - paste text below)' : 
                       file.type === 'text/plain' ? '(TXT)' : '(DOCX)'}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Text areas for each uploaded file */}
              <div className="space-y-3 mt-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="space-y-2">
                    <Label className="text-xs font-medium text-slate-600">
                      {file.name} - Resume Text
                    </Label>
                    <textarea
                      className="w-full min-h-[100px] p-2 border border-slate-300 rounded text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Paste text for ${file.name}...`}
                      onChange={(e) => {
                        const newFiles = [...uploadedFiles];
                        (newFiles[index] as any).text = e.target.value;
                        setUploadedFiles(newFiles);
                      }}
                    />
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => {
                  const resumeData = uploadedFiles.map(file => ({
                    filename: file.name,
                    text: (file as any).text || ''
                  }));
                  onTextSubmit(JSON.stringify(resumeData));
                }}
                className="w-full"
                disabled={uploadedFiles.length === 0}
              >
                Rank Resumes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}