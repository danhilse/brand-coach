// components/CustomSelect.tsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Platform, platforms } from '@/components/ContentContext';

interface CustomSelectProps {
  value: Platform;
  onChange: (value: Platform) => void;
}

export const CustomSelect = ({ value, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full
          h-[36px]
          pl-3
          pr-10
          border
          rounded
          font-['Open_Sans']
          text-[14px]
          leading-[24px]
          text-[var(--text)]
          bg-[var(--white)]
          border-[var(--border)]
          hover:border-[var(--dark-blue-base)]
          focus:outline-none
          focus:border-[var(--primary-base)]
          focus:shadow-[0_0_0_2px_rgba(0,186,190,0.2)]
          text-left
          relative
        `}
      >
        {value}
        <ChevronDown 
          className={`
            absolute 
            right-3 
            top-[11px] 
            w-4 
            h-4 
            text-[var(--text-light)]
            transition-transform
            ${isOpen ? 'transform rotate-180' : ''}
          `} 
        />
      </button>

      {isOpen && (
        <div 
          className={`
            absolute
            z-50
            w-full
            mt-1
            py-3
            rounded
            bg-white
            border
            border-[var(--border)]
            shadow-[0px_6px_12px_0px_#0000000f]
          `}
        >
          {platforms.map((option) => (
            <div
              key={option}
              className={`
                px-3
                py-[6px]
                hover:bg-[var(--table-hover-1)]
                cursor-pointer
                text-[14px]
                leading-[24px]
                font-['Open_Sans']
                text-[var(--text)]
                ${value === option ? 'bg-[var(--table-hover-1)]' : ''}
              `}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};