// components/Card.tsx
interface CardProps {
    children: React.ReactNode;
    className?: string;
  }
  
  export const Card = ({ children, className = '' }: CardProps) => (
    <div className={`
      bg-[var(--white)] 
      p-6 
      rounded 
      border 
      border-[var(--border)]
      shadow-[0_2px_4px_rgba(0,0,0,0.12)]
      ${className}
    `}>
      {children}
    </div>
  );