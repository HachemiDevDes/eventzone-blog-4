import { isValidSlug } from '@/lib/slugify';

interface SEOCheck {
  label: string;
  pass: boolean;
}

interface SEOScorePanelProps {
  seoTitle: string;
  seoDescription: string;
  coverImageAlt: string;
  content: string;
  slug: string;
  readingTime: number;
  ogImageUrl: string;
}

export default function SEOScorePanel({
  seoTitle,
  seoDescription,
  coverImageAlt,
  content,
  slug,
  readingTime,
  ogImageUrl,
}: SEOScorePanelProps) {
  const hasH2 = /<h2[\s>]/i.test(content);

  const checks: SEOCheck[] = [
    {
      label: 'Titre entre 40 et 60 caractères',
      pass: seoTitle.length >= 40 && seoTitle.length <= 60,
    },
    {
      label: 'Méta-description entre 130 et 160 caractères',
      pass: seoDescription.length >= 130 && seoDescription.length <= 160,
    },
    {
      label: 'Image de couverture a un texte alternatif',
      pass: coverImageAlt.trim().length > 0,
    },
    {
      label: 'Contenu contient au moins un titre H2',
      pass: hasH2,
    },
    {
      label: 'Slug propre (sans caractères spéciaux)',
      pass: isValidSlug(slug),
    },
    {
      label: 'Temps de lecture > 2 minutes',
      pass: readingTime >= 2,
    },
    {
      label: 'Image Open Graph uploadée',
      pass: ogImageUrl.trim().length > 0,
    },
  ];

  const score = checks.filter((c) => c.pass).length;
  const percent = Math.round((score / checks.length) * 100);

  const scoreColor =
    percent >= 80 ? 'text-success' : percent >= 50 ? 'text-warning' : 'text-danger';
  const progressColor =
    percent >= 80 ? 'bg-success' : percent >= 50 ? 'bg-warning' : 'bg-danger';

  return (
    <div>
      {/* Score Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-body-sm font-medium text-text-primary">Score SEO</p>
        <span className={`font-heading font-bold text-heading-sm ${scoreColor}`}>
          {percent}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-border rounded-full mb-4 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Checklist */}
      <ul className="space-y-2">
        {checks.map((check, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <span className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
              check.pass ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
            }`}>
              {check.pass ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              )}
            </span>
            <span className={`text-body-sm leading-tight ${check.pass ? 'text-text-secondary' : 'text-text-muted'}`}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
