// Alert.tsx
import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export const Alert = ({ children, variant = 'default' }: AlertProps) => {
  const variantStyles = {
    default: 'bg-slate-50 text-slate-900 border-slate-200',
    destructive: 'bg-red-50 text-red-900 border-red-200'
  };

  return (
    <div className={`relative w-full rounded-lg border p-4 
      ${variantStyles[variant]}`}
      role="alert"
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm [&_p]:leading-relaxed">
    {children}
  </div>
);