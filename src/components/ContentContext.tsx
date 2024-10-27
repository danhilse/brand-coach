// ContentContext.tsx
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const platforms = [
  'General',
  'Blog',
  'Website',
  'LinkedIn',
  'Case Study',
  'Email',
  'Video',
  'Webinar',
  'PR'
] as const;

export type Platform = typeof platforms[number];

export interface ContentContextProps {
  platform: Platform;
  goals: string;
  onPlatformChange: (platform: Platform) => void;
  onGoalsChange: (goals: string) => void;
}

export const ContentContext = ({
  platform = 'General',
  goals = '',
  onPlatformChange,
  onGoalsChange
}: ContentContextProps) => {
  return (
    <div className="flex flex-col gap-4 flex-2">
      <div>
        <label
          htmlFor="platform"
          className="block mb-2 text-[14px] leading-[20px] font-semibold text-[var(--text)]"
        >
          Platform
        </label>
        <div className="relative">
          <select
            id="platform"
            value={platform}
            onChange={(e) => onPlatformChange(e.target.value as Platform)}
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
              appearance-none
              cursor-pointer
            `}
          >
            {platforms.map(p => (
              <option
                key={p}
                value={p}
                className="py-[6px] px-[12px] hover:bg-[var(--table-hover-1)] rounded"
              >
                {p}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-[11px] w-4 h-4 text-[var(--text-light)] pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <label
          htmlFor="goals"
          className="block mb-2 text-[14px] leading-[20px] font-semibold text-[var(--text)]"
        >
          Communication Goals
        </label>
        <textarea
          id="goals"
          value={goals}
          onChange={(e) => onGoalsChange(e.target.value)}
          placeholder="Describe your communication objectives..."
          className={`
            flex-1
            w-full
            px-3
            py-2
            border
            rounded
            font-['Open_Sans']
            text-[14px]
            leading-[24px]
            text-[var(--text)]
            bg-[var(--white)]
            placeholder:text-[var(--text-light)]
            border-[var(--border)]
            hover:border-[var(--dark-blue-base)]
            focus:outline-none
            focus:border-[var(--primary-base)]
            focus:shadow-[0_0_0_2px_rgba(0,186,190,0.2)]
            resize-none
          `}
          style={{
            height: 'calc(100% - 60px)'
          }}
        />
      </div>
    </div>
  );
};