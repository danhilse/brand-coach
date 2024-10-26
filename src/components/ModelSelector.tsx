// components/ModelSelector.tsx
import React from 'react';
import type { ApiProvider } from '@/lib/types';

interface ModelSelectorProps {
  value: ApiProvider;
  onChange: (value: ApiProvider) => void;
}

const models = [
  { value: 'anthropic', label: 'Claude (Anthropic)' },
  { value: 'openai', label: 'GPT-4 (OpenAI)' },
  { value: 'test', label: 'Test Mode' }
] as const;

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value as ApiProvider)}
      className="px-4 py-2 border border-[var(--border)] rounded-md bg-white text-[var(--text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-base)]"
    >
      {models.map(model => (
        <option key={model.value} value={model.value}>
          {model.label}
        </option>
      ))}
    </select>
  );
}