import React from 'react';
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ResumeParserViewProps {
  rawText?: string | null;
  fileName?: string | null;
  status?: 'success' | 'error' | 'pending';
}

export function ResumeParserView({ rawText, fileName, status = 'success' }: ResumeParserViewProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-950">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 font-mono">
            {fileName ?? 'resume.pdf'}
          </span>
        </div>
        {status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
        {status === 'error' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
      </div>

      {/* Content */}
      <div className="max-h-64 overflow-y-auto p-4">
        {rawText ? (
          <pre className="text-xs text-slate-600 dark:text-slate-400 font-mono whitespace-pre-wrap leading-relaxed">
            {rawText}
          </pre>
        ) : (
          <p className="text-sm text-slate-400 italic text-center py-8">No parsed content available.</p>
        )}
      </div>
    </div>
  );
}