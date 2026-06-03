'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Globe, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default function BlogHeader({ currentLang: propLang }: { currentLang?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };


  // Derive lang from pathname segments if not provided
  // Pathname looks like /fr/blog or /en/blog
  const segments = pathname.split('/');
  const currentLang = propLang || segments[1] || 'fr';

  const langNames: Record<string, string> = {
    fr: 'Français',
    en: 'English'
  };

  // Helper to trigger Google Translate
  const triggerTranslation = (langCode: string) => {
    const googleCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (googleCombo) {
      googleCombo.value = langCode;
      googleCombo.dispatchEvent(new Event('change'));
    }
  };

  // Sync translation and close menu on route change
  useEffect(() => {
    setIsOpen(false);
    if (currentLang && currentLang !== 'fr') {
      setTimeout(() => triggerTranslation(currentLang), 1000);
    } else if (currentLang === 'fr') {
      // Revert if back to FR
      setTimeout(() => triggerTranslation('fr'), 1000);
    }
  }, [currentLang]);

  // Generate URL for language change while preserving current route
  const getLangUrl = (code: string) => {
    const segments = pathname.split('/');
    // Check if the first segment is a known locale
    const hasLocale = ['fr', 'en'].includes(segments[1]);

    if (hasLocale) {
      segments[1] = code;
      return segments.join('/');
    }
    return `/${code}${pathname}`;
  };

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <img
              src="https://images2.imgbox.com/02/39/OksF9irW_o.png"
              alt="Eventzone"
              className="h-7 w-auto object-contain dark:brightness-0 dark:invert transition-all hover:scale-105"
            />
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface-hover/50 text-text-secondary hover:text-primary hover:border-primary/50 transition-all mr-1"
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <div className="w-5 h-5 animate-pulse rounded-full bg-text-secondary/20" />
              ) : resolvedTheme === 'dark' ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            {/* Language Toggle */}
            <div className="relative group mr-2">
              <button className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface-hover/50 text-text-secondary hover:text-primary hover:border-primary/50 transition-all" aria-label="Switch language">
                <Globe size={18} />
              </button>

              <div className="absolute top-full right-0 mt-2 w-36 py-2 bg-surface border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
                {Object.entries(langNames).map(([code, name]) => (
                  <Link
                    key={code}
                    href={getLangUrl(code)}
                    onClick={() => triggerTranslation(code)}
                    className={`w-full px-4 py-2 text-left text-body-sm flex items-center justify-between hover:bg-surface-hover transition-colors ${currentLang === code ? 'text-primary font-medium' : 'text-text-secondary'
                      }`}
                  >
                    {name}
                    {currentLang === code && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="https://landing.eventzone.pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-body-sm py-2 px-6"
            >
              Learn More
            </Link>
            <Link
              href="https://calendly.com/eventzone114/eventzone-demo-meeting-all-in-one-event-management"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-body-sm py-2 px-6 shadow-glow"
            >
              Demander une démo
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-text-muted hover:text-text-primary transition-colors z-50"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 z-40 bg-surface border-b border-border shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-6">
            <div className="flex items-center justify-center gap-4">
              {/* Theme Toggle (Mobile) */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface-hover/50 text-text-secondary hover:text-primary hover:border-primary/50 transition-all"
                aria-label="Toggle theme"
              >
                {!mounted ? (
                  <div className="w-5 h-5 animate-pulse rounded-full bg-text-secondary/20" />
                ) : resolvedTheme === 'dark' ? (
                  <Sun size={18} />
                ) : (
                  <Moon size={18} />
                )}
              </button>

              {Object.entries(langNames).map(([code, name]) => (
                <Link
                  key={code}
                  href={getLangUrl(code)}
                  onClick={() => {
                    triggerTranslation(code);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 rounded-xl border text-body-sm transition-all ${currentLang === code
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface-hover text-text-secondary border-border'
                    }`}
                >
                  {name}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Link
                href="https://landing.eventzone.pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-body-sm w-full py-3 text-center block"
                onClick={() => setIsOpen(false)}
              >
                Learn More
              </Link>
              <Link
                href="https://calendly.com/eventzone114/eventzone-demo-meeting-all-in-one-event-management"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-body-sm w-full py-3 text-center block shadow-glow"
                onClick={() => setIsOpen(false)}
              >
                Demander une démo
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
