import Link from 'next/link';

export default function BlogFooter() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <img
                src="https://images2.imgbox.com/02/39/OksF9irW_o.png"
                alt="Eventzone"
                className="h-7 w-auto object-contain dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="text-body-sm text-text-muted max-w-md">
              La plateforme de gestion d&apos;événements tout-en-un pour les professionnels en France et en Afrique du Nord.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-body-sm text-text-primary mb-3">
              Blog
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-body-sm text-text-muted hover:text-primary transition-colors">
                  Tous les articles
                </Link>
              </li>
              <li>
                <Link href="/blog/category/guides" className="text-body-sm text-text-muted hover:text-primary transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/blog/category/actualites" className="text-body-sm text-text-muted hover:text-primary transition-colors">
                  Actualités
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-body-sm text-text-primary mb-3">
              Eventzone
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="https://eventzone.pro" target="_blank" rel="noopener noreferrer" className="text-body-sm text-text-muted hover:text-primary transition-colors">
                  Plateforme
                </Link>
              </li>
              <li>
                <Link href="https://calendly.com/eventzone114/eventzone-demo-meeting-all-in-one-event-management" target="_blank" rel="noopener noreferrer" className="text-body-sm text-text-muted hover:text-primary transition-colors">
                  Demander une démo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-caption text-text-muted">
            © {new Date().getFullYear()} Eventzone. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
            <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
