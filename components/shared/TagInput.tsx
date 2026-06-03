'use client';

import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({ tags, onChange, placeholder = 'Ajouter un tag...' }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="input flex flex-wrap gap-2 min-h-[48px] cursor-text" onClick={() => document.getElementById('tag-input')?.focus()}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-soft text-primary rounded-lg text-caption font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="hover:text-primary-hover transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <input
          id="tag-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input && addTag(input)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-body-sm"
        />
      </div>

      {/* Suggested Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-caption text-text-muted mr-1.5 py-1">Suggestions :</span>
        {['événementiel', 'digitalisation', 'networking', 'productivité', 'marketing', 'engagement', 'analytics'].map((suggestedTag) => {
          const isAdded = tags.includes(suggestedTag);
          return (
            <button
              key={suggestedTag}
              type="button"
              disabled={isAdded}
              onClick={() => addTag(suggestedTag)}
              className={`px-2.5 py-1 rounded-lg text-caption transition-all ${
                isAdded 
                  ? 'bg-surface text-text-muted cursor-not-allowed border border-border' 
                  : 'bg-surface hover:bg-surface-hover text-text-secondary border border-border hover:border-primary/30'
              }`}
            >
              {isAdded ? '✓ ' : '+ '}{suggestedTag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
