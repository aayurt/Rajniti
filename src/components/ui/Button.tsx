import React, { MouseEvent } from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}

export function Button({
  children,
  type = 'button',
  onClick,
  disabled = false,
  className,
}: ButtonProps) {
  const baseClasses = 'rounded-lg px-3 py-2 text-sm min-h-[44px]';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${className} disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

Button.displayName = 'Button';