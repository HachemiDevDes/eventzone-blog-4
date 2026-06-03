'use client';

import { useEffect, useState } from 'react';

export default function TranslationBridge() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Ensure googleTranslateElementInit is globally available
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'fr,en',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
      }
    };

    // Load the script if not already present
    const scriptId = 'google-translate-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div
      id="google_translate_element"
      style={{ display: 'none', visibility: 'hidden', position: 'absolute', top: '-9999px' }}
      aria-hidden="true"
    />
  );
}
