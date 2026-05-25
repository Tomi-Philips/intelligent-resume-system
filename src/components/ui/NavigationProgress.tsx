'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, Suspense } from 'react';

function NavigationProgressInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prevPath = useRef<string>('');

  const currentPath = `${pathname}?${searchParams}`;

  // Start the progress bar
  const startProgress = () => {
    setProgress(0);
    setVisible(true);
    let p = 0;
    intervalRef.current = setInterval(() => {
      // Ease toward 90% — never reaching 100 until we finish
      p += (90 - p) * 0.08;
      setProgress(p);
    }, 80);
  };

  // Finish and hide the bar
  const finishProgress = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 400);
  };

  useEffect(() => {
    // Path changed → navigation complete
    if (prevPath.current && prevPath.current !== currentPath) {
      finishProgress();
    }
    prevPath.current = currentPath;
  }, [currentPath]);

  // Listen for clicks on internal links to trigger the bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      startProgress();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-200 ease-out rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.7)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// Wrap in Suspense because useSearchParams() requires it in Next.js App Router
export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressInner />
    </Suspense>
  );
}
