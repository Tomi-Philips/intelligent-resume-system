'use client';

import React, { useState, useCallback } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle2 } from 'lucide-react';
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
  const [uploadDone, setUploadDone] = useState(false);
  const [error, setError] = useState('');

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
      (file) =>
        file.type === 'application/pdf' ||
        file.name.endsWith('.docx') ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );

    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');
    try {
      await resumeService.uploadResumes(jobId, files);
      setUploadDone(true);
      // Keep isUploading=true so the button spinner persists through the
      // navigation. The component will unmount when the new page loads.
      router.push(`/jobs/${jobId}`);
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm animate-pulse-once">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {/* Success banner — shown while navigating away */}
      {uploadDone && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Upload successful!
            </p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
              Redirecting to job details…
            </p>
          </div>
          <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/5 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud
          className={`w-12 h-12 mb-4 transition-colors ${
            isDragging ? 'text-blue-500' : 'text-slate-400'
          }`}
        />
        <h3 className="text-lg font-medium">Drag &amp; Drop Resumes</h3>
        <p className="text-sm text-slate-500 mt-1 mb-4">Supports PDF and DOCX formats</p>

        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="inline-flex items-center justify-center rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 h-10 px-4 transition-colors">
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

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <FileIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span className="text-sm truncate font-medium">{file.name}</span>
                  <span className="text-xs text-slate-500 flex-shrink-0">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  disabled={isUploading}
                  className="text-slate-400 hover:text-rose-500 transition-colors p-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Processing hint */}
            {isUploading && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                Processing {files.length} resume{files.length > 1 ? 's' : ''}… this may take a moment
              </p>
            )}
            <div className="ml-auto">
              <Button
                onClick={handleUpload}
                isLoading={isUploading}
                disabled={isUploading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-blue-500/25 px-6 h-11"
              >
                {isUploading
                  ? uploadDone
                    ? 'Redirecting…'
                    : 'Uploading…'
                  : `Upload ${files.length} Resume${files.length > 1 ? 's' : ''}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
