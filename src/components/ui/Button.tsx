'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'brutalist' | 'brutalist-secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  const [localLoading, setLocalLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;
    
    // If it's an async function, we can await it
    setLocalLoading(true);
    try {
      await onClick(e);
    } finally {
      setLocalLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  let variantClasses = '';
  if (variant === 'primary') variantClasses = 'bg-ink text-white hover:bg-ink/90 border-transparent rounded-xl shadow-md transition-all font-semibold';
  if (variant === 'secondary') variantClasses = 'bg-white text-ink hover:bg-bone border border-ink/20 rounded-xl shadow-sm transition-all font-semibold';
  if (variant === 'danger') variantClasses = 'bg-persimmon text-white hover:bg-persimmon/90 border-transparent rounded-xl shadow-md transition-all font-semibold';
  if (variant === 'brutalist') variantClasses = 'bg-ink text-white rounded-xl shadow-md hover:bg-ink/90 font-semibold transition-all';
  if (variant === 'brutalist-secondary') variantClasses = 'bg-white text-ink border border-ink/20 rounded-xl shadow-sm hover:bg-bone font-semibold transition-all';

  const baseClasses = 'inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick ? handleClick : undefined}
      disabled={disabled || localLoading || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses} ${className}`}
      {...props}
    >
      {localLoading || isLoading ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>Wird verarbeitet...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
