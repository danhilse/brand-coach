// DocumentInput.tsx
import { useState, useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { ContentContext, type Platform } from './ContentContext';

interface DocumentInputProps {
  value: string;
  platform: Platform;
  goals: string;
  onChange: (text: string) => void;
  onPlatformChange: (platform: Platform) => void;
  onGoalsChange: (goals: string) => void;
  onError: (error: string) => void;
}


export const DocumentInput = ({ 
  value, 
  platform,
  goals,
  onChange,
  onPlatformChange,
  onGoalsChange,
  onError 
}: DocumentInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/parse-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `HTTP error! status: ${res.status}`);
      }

      onChange(data.text);
      onError('');
    } catch (err) {
      console.error('Error parsing file:', err);
      onError(err instanceof Error ? err.message : 'Failed to read file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    await handleFile(file);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
      e.target.value = '';
    }
  };

  const baseInputStyles = `
    w-full 
    min-h-[200px] 
    pl-3 
    py-2
    pr-10 /* Added padding to the right */
    border 
    rounded 
    font-['Open_Sans']
    text-[var(--text)]
    bg-[var(--white)]
    placeholder:text-[var(--text-light)]
    focus:outline-none
    focus:border-[var(--primary-base)]
    focus:shadow-[0_0_0_2px_rgba(0,186,190,0.2)]
    resize-y
  `;

  const dragStyles = isDragging ? `
    border-[var(--primary-base)]
  ` : `
    border-[var(--border)]
    hover:border-[var(--dark-blue-base)]
  `;

  return (
    <div className="flex gap-4">
      <ContentContext 
        platform={platform}
        goals={goals}
        onPlatformChange={onPlatformChange}
        onGoalsChange={onGoalsChange}
      />
      <div className="flex-1 relative">
        <label 
          htmlFor="text" 
          className="block mb-2 text-[14px] leading-[20px] font-semibold text-[var(--text)]"
        >
          Enter text to evaluate:
        </label>
        <div 
          className={`relative h-full ${isDragging ? 'border-[var(--primary-base)]' : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <textarea
            id="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputStyles} ${dragStyles} h-[calc(100%-30px)]`}
            placeholder="Paste your text here or drag and drop a file..."
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`
              absolute 
              top-2 
              right-2 
              p-2 
              text-[var(--text-light)]
              hover:text-[var(--text)] 
              rounded-full 
              hover:bg-[var(--table-hover-1)]
              transition-colors
              duration-200
            `}
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
        {isDragging && (
          <div className={`
            absolute 
            inset-0 
            border-2 
            border-[var(--primary-base)] 
            rounded 
            bg-[var(--table-hover-1)]
            bg-opacity-50 
            flex 
            items-center 
            justify-center 
            pointer-events-none
            mt-8
          `}>
            <p className="text-[var(--primary-base)] font-semibold">Drop file here</p>
          </div>
        )}
      </div>


    </div>
  );
};