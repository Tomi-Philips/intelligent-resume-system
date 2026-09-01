import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** When true, only render the icon mark (no text) */
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', iconOnly = false }) => {
  const sizes = {
    sm: { icon: 22, text: 'text-[14px]' },
    md: { icon: 26, text: 'text-[15px]' },
    lg: { icon: 32, text: 'text-[18px]' },
  };

  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Geometric mark — two connected nodes */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Background rounded square */}
        <rect width="26" height="26" rx="6" fill="#18181B" />
        {/* Left node */}
        <circle cx="9" cy="13" r="3" fill="#3B82F6" />
        {/* Right node */}
        <circle cx="17" cy="13" r="3" fill="#3B82F6" opacity="0.5" />
        {/* Connecting line */}
        <line x1="12" y1="13" x2="14" y2="13" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {!iconOnly && (
        <span className={`${textSize} tracking-[-0.03em]`}>
          <span className="font-bold text-zinc-900">Hire</span>
          <span className="font-medium text-zinc-400">Logic</span>
        </span>
      )}
    </span>
  );
};
