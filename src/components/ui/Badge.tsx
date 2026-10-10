import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  className,
}: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';