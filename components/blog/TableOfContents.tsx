'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const elements = doc.querySelectorAll('h2, h3');
    const items: TOCItem[] = [];

    elements.forEach((el, index) => {
      const id = el.id || `heading-${index}`;
      items.push({
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      });
    });

    setHeadings(items);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      {/* Mobile: Collapsible TOC */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 card"
        >
          <span className="font-heading font-semibold text-body-sm text-text-primary">
            Table des matières
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {isOpen && (
          <nav className="card border-t-0 rounded-t-none p-4 animate-fade-in-down">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setIsOpen(false)}
                    className={`block text-body-sm transition-colors ${
                      heading.level === 3 ? 'pl-4' : ''
                    } ${
                      activeId === heading.id
                        ? 'text-primary font-medium'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop: Sticky sidebar TOC */}
      <nav className="hidden lg:block sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
        <p className="font-heading font-semibold text-body-sm text-text-primary mb-4">
          Table des matières
        </p>
        <ul className="space-y-1 border-l border-border pl-4">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`block py-1.5 text-body-sm transition-all ${
                  heading.level === 3 ? 'pl-3' : ''
                } ${
                  activeId === heading.id
                    ? 'text-primary font-medium border-l-2 border-primary -ml-[17px] pl-[15px]'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
