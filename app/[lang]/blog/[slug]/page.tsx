import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createStaticSupabaseClient } from '@/lib/supabase-server';
import { generateArticleMetadata, generateArticleJsonLd, getSiteUrl } from '@/lib/seo';
import { formatReadingTime } from '@/lib/reading-time';
import { Post } from '@/lib/types';
import { format } from 'date-fns';
import { fr, enUS, arSA } from 'date-fns/locale';

const dateLocales: Record<string, any> = { fr, en: enUS, ar: arSA };
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import ShareButtons from '@/components/blog/ShareButtons';
import AuthorCard from '@/components/blog/AuthorCard';
import RelatedPosts from '@/components/blog/RelatedPosts';
import CTABanner from '@/components/blog/CTABanner';
import SEOHead from '@/components/shared/SEOHead';
import ArticleTracker from './ViewTracker';

export const revalidate = 60;

import { cache } from 'react';

const getPost = cache(async (slug: string): Promise<Post | null> => {
  const supabase = createStaticSupabaseClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return data as Post | null;
});

async function getRelatedPosts(post: Post): Promise<Post[]> {
  const supabase = createStaticSupabaseClient();
  const { data } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image_url, cover_image_alt, category, lang, published_at, created_at, reading_time_minutes, author_name, author_avatar_url')
    .eq('status', 'published')
    .neq('id', post.id)
    .eq('category', post.category)
    .order('published_at', { ascending: false })
    .limit(3);

  if (data && data.length >= 3) return data as Post[];

  // If not enough from same category, fill with tag-matched posts
  const { data: tagPosts } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image_url, cover_image_alt, category, lang, published_at, created_at, reading_time_minutes, author_name, author_avatar_url')
    .eq('status', 'published')
    .neq('id', post.id)
    .overlaps('tags', post.tags || [])
    .order('published_at', { ascending: false })
    .limit(3 - (data?.length || 0));

  const combined = [...(data || []), ...(tagPosts || [])];
  const unique = combined.filter(
    (p, index, self) => self.findIndex((s) => s.id === p.id) === index
  );
  return unique.slice(0, 3) as Post[];
}

export async function generateStaticParams() {
  const supabase = createStaticSupabaseClient();
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published');

  return (data || []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; lang: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Article non trouvé' };
  return generateArticleMetadata(post, params.lang);
}



function addIdsToHeadings(html: string): string {
  let counter = 0;
  return html.replace(/<(h[23])([^>]*)>(.*?)<\/h[23]>/gi, (match, tag, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 60) || `heading-${counter}`;
    counter++;
    return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
  });
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string; lang: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const currentLang = params.lang || post.lang || 'fr';
  const relatedPosts = await getRelatedPosts(post);
  const siteUrl = getSiteUrl();
  const articleUrl = `${siteUrl}/${currentLang}/blog/${post.slug}`;
  const isRtl = currentLang === 'ar';

  const processedContent = addIdsToHeadings(post.content || '');
  const locale = dateLocales[currentLang] || fr;
  const dateStr = post.published_at || post.created_at;
  const date = dateStr ? format(new Date(dateStr), 'd MMMM yyyy', { locale }) : '';

  // Split content for CTA injection
  const contentParts = processedContent.split('</p>');
  const beforeCta = contentParts.slice(0, 3).join('</p>') + (contentParts.length > 3 ? '</p>' : '');
  const afterCta = contentParts.length > 3 ? contentParts.slice(3).join('</p>') : '';

  return (
    <>
      <SEOHead jsonLd={generateArticleJsonLd(post)} />
      <ArticleTracker postId={post.id} />

      <article
        className={`max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 ${isRtl ? 'font-arabic' : ''}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Blog', href: `/${currentLang}/blog` },
            ...(post.category
              ? [{ label: post.category, href: `/${currentLang}/blog/category/${encodeURIComponent(post.category)}` }]
              : []),
            { label: post.title },
          ]}
        />

        {/* Cover Image */}
        {post.cover_image_url && (
          <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8 animate-fade-in">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt || post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        )}

        {/* Article Header */}
        <header className="max-w-3xl mx-auto mb-10 animate-fade-in-up">
          {post.category && (
            <span className="badge-primary mb-4 inline-block">{post.category}</span>
          )}
          <h1 className="font-heading font-extrabold text-display-sm md:text-display text-text-primary mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-body-lg text-text-secondary italic mb-6">
              {post.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-body-sm text-text-muted">
            <div className="flex items-center gap-2">
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
              <span className="text-text-secondary">{post.author_name || 'Eventzone'}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <time dateTime={post.published_at || post.created_at}>{date}</time>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>{formatReadingTime(post.reading_time_minutes, post.lang)}</span>
          </div>
        </header>

        {/* Content Layout */}
        <div className="max-w-3xl mx-auto">
          {/* Content before CTA */}
          <div
            className="prose-eventzone"
            dangerouslySetInnerHTML={{ __html: beforeCta }}
          />

          {/* CTA Banner with tracking */}
          {contentParts.length > 3 && <CTABanner postId={post.id} />}

          {/* Content after CTA */}
          {afterCta && (
            <div
              className="prose-eventzone"
              dangerouslySetInnerHTML={{ __html: afterCta }}
            />
          )}

          {/* Share Buttons */}
          <div className="mt-10 pt-8 border-t border-border">
            <ShareButtons
              url={articleUrl}
              title={post.title}
              description={post.excerpt || undefined}
            />
          </div>

          {/* Author Card */}
          <div className="mt-10">
            <AuthorCard
              name={post.author_name || 'Eventzone'}
              avatarUrl={post.author_avatar_url}
            />
          </div>

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />
        </div>
      </article>
    </>
  );
}
