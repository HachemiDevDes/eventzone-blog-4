import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createStaticSupabaseClient } from '@/lib/supabase-server';
import { formatReadingTime } from '@/lib/reading-time';
import { Post } from '@/lib/types';
import { format } from 'date-fns';
import { fr, enUS, arSA } from 'date-fns/locale';

const dateLocales: Record<string, any> = { fr, en: enUS, ar: arSA };
import Breadcrumbs from '@/components/blog/Breadcrumbs';
import AuthorCard from '@/components/blog/AuthorCard';

export const revalidate = 0;

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

async function getPostById(id: string): Promise<Post | null> {
  const supabase = createStaticSupabaseClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  return data as Post | null;
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

export default async function PreviewPage({
  params,
}: {
  params: { id: string; lang: string };
}) {
  const post = await getPostById(params.id);
  if (!post) notFound();

  const currentLang = params.lang || post.lang || 'fr';
  const isRtl = post.lang === 'ar';

  const processedContent = addIdsToHeadings(post.content || '');
  const locale = dateLocales[currentLang] || fr;
  const dateStr = post.published_at || post.created_at;
  const date = dateStr ? format(new Date(dateStr), 'd MMMM yyyy', { locale }) : 'Draft';

  return (
    <article
      className={`max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 ${isRtl ? 'font-arabic' : ''}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl mb-6 text-center font-medium">
        Modo de Prévisualisation — Cet article n&apos;est pas encore public.
      </div>

      <Breadcrumbs
        items={[
          { label: 'Blog', href: `/${currentLang}/blog` },
          { label: 'Aperçu' },
          { label: post.title },
        ]}
      />

      {post.cover_image_url && (
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-8">
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt || post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <header className="max-w-3xl mx-auto mb-10">
        <h1 className="font-heading font-extrabold text-display-sm md:text-display text-text-primary mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-body-sm text-text-muted">
          <span>{post.author_name || 'Eventzone'}</span>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          <time>{date}</time>
          <span className="w-1 h-1 rounded-full bg-text-muted" />
          <span>{formatReadingTime(post.reading_time_minutes, post.lang)}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto">
        <div
          className="prose-eventzone"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        
        <div className="mt-10">
          <AuthorCard
            name={post.author_name || 'Eventzone'}
            avatarUrl={post.author_avatar_url}
          />
        </div>
      </div>
    </article>
  );
}
