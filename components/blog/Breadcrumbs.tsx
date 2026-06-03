import Link from 'next/link';
import SEOHead from '@/components/shared/SEOHead';
import { generateBreadcrumbJsonLd, getSiteUrl } from '@/lib/seo';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const siteUrl = getSiteUrl();
  const fullItems = [{ label: 'Accueil', href: '/' }, ...items];

  const jsonLdItems = fullItems.map((item) => ({
    name: item.label,
    url: item.href ? `${siteUrl}${item.href}` : siteUrl,
  }));

  return (
    <>
      <SEOHead jsonLd={generateBreadcrumbJsonLd(jsonLdItems)} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center gap-2 text-body-sm text-text-muted flex-wrap">
          {fullItems.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
              {item.href && index < fullItems.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={index === fullItems.length - 1 ? 'text-text-secondary font-medium truncate max-w-[200px]' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
