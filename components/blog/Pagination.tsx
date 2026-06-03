import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const range = [];

  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i);
  }

  if (currentPage - delta > 2) {
    pages.push(1, '...');
  } else {
    pages.push(1);
  }

  pages.push(...range);

  if (currentPage + delta < totalPages - 1) {
    pages.push('...', totalPages);
  } else if (totalPages > 1) {
    pages.push(totalPages);
  }

  // Remove duplicates using Array.from instead of spread for TS compatibility
  const uniquePages = Array.from(new Set(pages));

  const getPageUrl = (page: number) => {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="btn-secondary px-3 py-2"
          aria-label="Page précédente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      )}

      {/* Page numbers */}
      {uniquePages.map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="px-2 text-text-muted">
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page as number)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-body-sm font-medium transition-all ${
              currentPage === page
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-text-secondary hover:border-primary/30 hover:text-primary'
            }`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="btn-secondary px-3 py-2"
          aria-label="Page suivante"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="rtl:rotate-180">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
