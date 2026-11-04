import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ hover = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`glass rounded-2xl ${hover ? 'glass-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
