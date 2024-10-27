// components/ui/LoadingButton.tsx
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const LoadingButton = ({ 
  isLoading, 
  children, 
  disabled, 
  className = '', 
  type = 'button' 
}: LoadingButtonProps) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={`btn-acton btn-acton-primary flex items-center justify-center gap-2 ${className}`}
  >
    {isLoading ? (
      <>
        {/* <LoadingSpinner size="small" className="text-white" /> */}
        <span>Evaluating...</span>
      </>
    ) : children}
  </button>
);