// components/ui/LoadingState.tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AnimatedLoadingMessage } from './AnimatedLoadingMessage';

export const LoadingState = () => (
  <div className="space-y-8">
    <div className="p-6 bg-[var(--app-background)] rounded-lg border border-[var(--border)]">
      <div className="flex items-center gap-3">
        <LoadingSpinner size="medium" className="text-[var(--primary-base)]" />
        <span className="text-[14px] leading-[20px] text-[var(--text-light)]">
          <AnimatedLoadingMessage />
        </span>
      </div>
      
      <div className="mt-6 space-y-6">
        <div className="space-y-3">
          <div className="h-4 loading-skeleton rounded w-3/4" />
          <div className="h-4 loading-skeleton rounded w-1/2" />
          <div className="h-4 loading-skeleton rounded w-2/3" />
        </div>
        
        <div className="space-y-3">
          <div className="h-4 loading-skeleton rounded w-2/3" />
          <div className="h-4 loading-skeleton rounded w-3/4" />
          <div className="h-4 loading-skeleton rounded w-1/2" />
        </div>
      </div>
    </div>
  </div>
);
