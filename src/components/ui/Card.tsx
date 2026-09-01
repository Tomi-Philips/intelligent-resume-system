import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Card({
  hoverEffect = false,
  children,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-white border border-zinc-200 rounded-xl transition-all ${
        hoverEffect ? 'hover:border-zinc-300 hover:shadow-xs' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
