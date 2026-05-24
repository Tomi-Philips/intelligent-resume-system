import React from 'react';
import { FileText, Download } from 'lucide-react';

interface ResumePreviewProps {
  filePath?: string | null;
  fileName?: string | null;
  supabaseUrl?: string;
  bucket?: string;
}

export function ResumePreview({ filePath, fileName, supabaseUrl, bucket = 'resumes' }: ResumePreviewProps) {
  const downloadUrl = filePath && supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/${bucket}/${filePath}`
    : null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
          {fileName ?? 'Resume file'}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">PDF / DOCX Document</p>
      </div>
      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
          download
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </a>
      )}
    </div>
  );
}