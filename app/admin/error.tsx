'use client';

import { useEffect } from 'react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[50vh]">
      <div className="text-center card p-8 max-w-md w-full">
        <div className="w-12 h-12 rounded-full bg-danger-soft flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="font-heading font-bold text-heading-sm text-text-primary mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-body-sm text-text-muted mb-6">
          Nous n&apos;avons pas pu charger cette page.
        </p>
        <button
          onClick={() => reset()}
          className="btn-primary w-full"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
