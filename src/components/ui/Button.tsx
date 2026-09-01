'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-5 py-2.5 text-base gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 shadow-xs',
      secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 active:bg-zinc-100 shadow-xs',
      outline: 'bg-transparent text-zinc-700 border border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100',
      ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
