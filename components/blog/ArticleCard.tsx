import Image from 'next/image';
import Link from 'next/link';
import { Post } from '@/lib/types';
import { formatReadingTime } from '@/lib/reading-time';
import { format } from 'date-fns';
import { fr, enUS, arSA } from 'date-fns/locale';

const dateLocales: Record<string, import('date-fns').Locale> = { fr, en: enUS, ar: arSA };

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
  currentLang?: string;
  priority?: boolean;
}

export default function ArticleCard({ post, featured = false, currentLang: propLang, priority = false }: ArticleCardProps) {
  const currentLang = propLang || post.lang || 'fr';
  const locale = dateLocales[currentLang] || fr;
  const dateStr = post.published_at || post.created_at;
  const date = dateStr ? format(new Date(dateStr), 'd MMM yyyy', { locale }) : '';

  return (
    <Link href={`/${currentLang}/blog/${post.slug}`} className="group block">
      <article
        className={`card overflow-hidden ${featured ? 'md:grid md:grid-cols-2 md:gap-0' : ''
          }`}
      >
        {/* Cover Image */}
        <div
          className={`relative overflow-hidden ${featured ? 'aspect-[16/10] md:aspect-auto md:min-h-[320px]' : 'aspect-[16/10]'
            }`}
        >
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, 33vw'}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-surface flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-primary/30">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}
          {/* Category Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {post.category && (
              <span className="h-6 flex items-center px-2.5 rounded-md backdrop-blur-md bg-primary/80 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
                {post.category}
              </span>
            )}
            <span className="h-6 min-w-[28px] flex items-center justify-center px-1.5 rounded-md backdrop-blur-md bg-black/40 border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider">
              {post.lang || 'FR'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? 'md:p-8 md:flex md:flex-col md:justify-center' : ''}`}>
          {/* Meta */}
          <div className="flex items-center gap-3 text-caption text-text-muted mb-3">
            <time dateTime={post.published_at || post.created_at}>{date}</time>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>{formatReadingTime(post.reading_time_minutes, post.lang)}</span>
          </div>

          {/* Title */}
          <h2
            className={`font-heading font-bold text-text-primary group-hover:text-primary transition-colors mb-3 ${featured ? 'text-heading-lg md:text-display-sm' : 'text-heading-sm'
              }`}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              className={`text-text-secondary mb-4 line-clamp-2 ${featured ? 'text-body-lg' : 'text-body-sm'
                }`}
            >
              {post.excerpt}
            </p>
          )}

          {/* Author */}
          <div className="flex items-center gap-3 mt-auto">
            {post.author_avatar_url ? (
              <Image
                src={post.author_avatar_url}
                alt={post.author_name || 'Author'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center">
                <span className="text-primary text-caption font-bold">
                  {(post.author_name || 'E')[0].toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-body-sm text-text-secondary">
              {post.author_name || 'Eventzone'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
