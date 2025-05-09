import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ className, children, onClick }) => {
  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn('p-4 border-b border-gray-100', className)}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn('p-4', className)}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn('p-4 border-t border-gray-100', className)}>
      {children}
    </div>
  );
};