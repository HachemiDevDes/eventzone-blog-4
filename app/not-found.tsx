import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="font-heading font-extrabold text-[10rem] leading-none text-transparent bg-clip-text bg-gradient-primary opacity-20 select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-border flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>

        <h1 className="font-heading font-bold text-heading-lg text-text-primary mb-3">
          Page introuvable
        </h1>
        <p className="text-body text-text-muted mb-8 max-w-md mx-auto">
          L&apos;article ou la page que vous cherchez n&apos;existe pas ou a été déplacé.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/blog" className="btn-primary">
            Retour au blog
          </Link>
          <Link href="/" className="btn-secondary">
            Accueil Eventzone
          </Link>
        </div>
      </div>
    </div>
  );
}
