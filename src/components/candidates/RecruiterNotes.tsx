'use client';

import React, { useState, useTransition } from 'react';
import { candidateService, CandidateNote } from '@/services/candidate.service';
import { Button } from '@/components/ui/Button';
import { StickyNote, Send, Trash2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RecruiterNotesProps {
  candidateId: string;
  initialNotes: CandidateNote[];
}

export function RecruiterNotes({ candidateId, initialNotes }: RecruiterNotesProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<CandidateNote[]>(initialNotes);
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleAdd = () => {
    if (!content.trim()) return;
    const text = content.trim();
    setContent('');

    startTransition(async () => {
      try {
        const newNote = await candidateService.addNote(candidateId, text);
        setNotes((prev) => [newNote, ...prev]);
        router.refresh();
      } catch (e) {
        console.error('Failed to add note:', e);
        setContent(text); // restore on failure
      }
    });
  };

  const handleDelete = async (noteId: string) => {
    setIsDeleting(noteId);
    const prev = notes;
    setNotes((n) => n.filter((x) => x.id !== noteId));
    try {
      await candidateService.deleteNote(noteId);
      router.refresh();
    } catch {
      setNotes(prev); // revert
    } finally {
      setIsDeleting(null);
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      {/* Add note */}
      <div className="flex gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a recruiter note... (e.g. 'Strong culture fit, good communication skills')"
          rows={3}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAdd();
          }}
        />
        <Button
          onClick={handleAdd}
          disabled={!content.trim() || isPending}
          className="self-end h-10 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-sm border-none gap-1.5 shrink-0"
        >
          <Send className="w-4 h-4" />
          {isPending ? 'Adding...' : 'Add'}
        </Button>
      </div>
      <p className="text-xs text-slate-400">Tip: Press Cmd/Ctrl+Enter to submit</p>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
          <StickyNote className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No notes yet. Be the first to add one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                R
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                  <Clock className="w-3 h-3" />
                  {formatTime(note.created_at)}
                </div>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                disabled={isDeleting === note.id}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10"
                aria-label="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
