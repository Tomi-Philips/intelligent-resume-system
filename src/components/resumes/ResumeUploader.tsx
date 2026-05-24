'use client';

import React, { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { resumeService } from '../../services/resume.service';
import { useRouter } from 'next/navigation';

interface ResumeUploaderProps {
  jobId: string;
}

export function ResumeUploader({ jobId }: ResumeUploaderProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf' || 
              file.name.endsWith('.docx') ||
              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    try {
      await resumeService.uploadResumes(jobId, files);
      router.push(`/jobs/${jobId}`);
      router.refresh();
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors
          ${isDragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium">Drag & Drop Resumes</h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">Supports PDF and DOCX formats</p>
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 h-10 py-2 px-4 transition-colors">
            Browse Files
          </div>
          <input 
            id="file-upload" 
            type="file" 
            multiple 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            className="hidden" 
            onChange={handleFileInput}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-sm">Selected Files ({files.length})</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <FileIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm truncate font-medium">{file.name}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <button 
                  onClick={() => removeFile(idx)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleUpload} isLoading={isUploading} className="w-full sm:w-auto">
              Upload {files.length} Resume{files.length > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
