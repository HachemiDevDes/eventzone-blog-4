'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, FormEvent, useEffect } from 'react';

interface SearchBarProps {
  currentLang?: string;
}

export default function SearchBar({ currentLang }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  // Sync state with URL changes (e.g. when user clears search or navigates back)
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    // Always keep language if it exists
    if (currentLang) {
      params.set('lang', currentLang);
    }
    router.push(`/blog?${params.toString()}`);
  };

  const placeholders: Record<string, string> = {
    fr: "Rechercher un guide, une astuce...",
    en: "Search for a guide, a tip...",
    ar: "بحث عن دليل، نصيحة..."
  };

  const btnLabels: Record<string, string> = {
    fr: "Rechercher",
    en: "Search",
    ar: "بحث"
  };

  return (
    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative animate-fade-in-up animate-delay-200">
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative flex items-center bg-surface border border-border rounded-2xl overflow-hidden shadow-hover">
          <div className="pl-4 pr-2 text-text-muted">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholders[currentLang || 'fr'] || placeholders.fr}
            className="w-full py-4 bg-transparent border-none outline-none text-body-sm placeholder:text-text-muted"
          />
          <button type="submit" className="mr-2 px-6 py-2 bg-primary text-white text-caption font-bold rounded-xl hover:bg-primary-hover transition-colors shadow-glow">
            {btnLabels[currentLang || 'fr'] || btnLabels.fr}
          </button>
        </div>
      </div>
    </form>
  );
}
