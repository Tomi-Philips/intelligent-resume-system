import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-zinc-50/50">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
