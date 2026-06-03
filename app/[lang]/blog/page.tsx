import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { createStaticSupabaseClient } from '@/lib/supabase-server';
import { generateBlogMetadata } from '@/lib/seo';
import { Post } from '@/lib/types';
import ArticleCard from '@/components/blog/ArticleCard';
import BlogSidebar from '@/components/blog/BlogSidebar';
import Pagination from '@/components/blog/Pagination';
import SearchBar from '@/components/blog/SearchBar';

export const revalidate = 60;
const POSTS_PER_PAGE = 6;

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  return generateBlogMetadata(params.lang || 'fr');
}

async function getPosts(page: number, query?: string, lang?: string) {
  const supabase = createStaticSupabaseClient();
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  let dbQuery = supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image_url, cover_image_alt, category, lang, published_at, created_at, reading_time_minutes, author_name, author_avatar_url', { count: 'exact' })
    .eq('status', 'published');

  if (query) {
    dbQuery = dbQuery.ilike('title', `%${query}%`);
  }

  // We no longer strictly filter by lang, but we keep it for sorting/logic
  // if (lang) {
  //   dbQuery = dbQuery.eq('lang', lang);
  // }

  const { data: posts, count } = await dbQuery
    .order('published_at', { ascending: false })
    .range(from, to);

  return {
    posts: (posts as Post[]) || [],
    totalCount: count || 0,
  };
}

import { unstable_cache } from 'next/cache';

const getSidebarData = unstable_cache(
  async () => {
    const supabase = createStaticSupabaseClient();

    const { data: catData } = await supabase
      .from('posts')
      .select('category')
      .eq('status', 'published')
      .not('category', 'is', null);

    const categories = Array.from(new Set(catData?.map((p) => p.category).filter(Boolean) || []));

    const { data: tagData } = await supabase
      .from('posts')
      .select('tags')
      .eq('status', 'published');

    const allTags = tagData?.flatMap((p) => p.tags || []) || [];
    const tagCounts = allTags.reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    const tags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 12)
      .map(([tag]) => tag);

    return { categories: categories as string[], tags };
  },
  ['blog-sidebar-data'],
  { revalidate: 60, tags: ['posts'] }
);

export default async function BlogPage({
  searchParams,
  params,
}: {
  searchParams: { page?: string; q?: string };
  params: { lang: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const query = searchParams.q || '';
  const currentLang = params.lang || 'fr';

  const [{ posts, totalCount }, { categories, tags }] = await Promise.all([
    getPosts(page, query, currentLang),
    getSidebarData(),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  const isRtl = currentLang === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-arabic' : ''}>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-30" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading font-extrabold text-display-sm md:text-display lg:text-display-xl text-text-primary mb-6 animate-fade-in-up tracking-tight">
            {currentLang === 'ar' ? (
              <>مدونة <span className="text-gradient">إيفينت زون</span></>
            ) : currentLang === 'en' ? (
              <>The <span className="text-gradient">Eventzone</span> Blog</>
            ) : (
              <>Le Blog <span className="text-gradient">Eventzone</span></>
            )}
          </h1>
          <p className="max-w-2xl mx-auto text-body-lg text-text-secondary mb-10 animate-fade-in-up animate-delay-100 leading-relaxed">
            {currentLang === 'ar' ?
              'الدليل الأساسي لمحترفي تنظيم الفعاليات الحديثة. اكتشف نصائحنا وأدلتنا واستراتيجياتنا المتميزة.' :
              currentLang === 'en' ?
                'The Essential Guide for modern event professionals. Discover our premium tips, guides and strategies.' :
                'Le Guide Essentiel pour les professionnels de l\'événementiel modernes. Découvrez nos conseils, guides et stratégies premium.'
            }
          </p>

          {/* Search Bar - Functional Client Component */}
          <Suspense fallback={<div className="max-w-xl mx-auto h-14 bg-surface rounded-2xl border border-border animate-pulse" />}>
            <SearchBar currentLang={currentLang} />
          </Suspense>
        </div>
      </section>

      {/* Content Section with refined layout */}
      <section className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 pb-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          {/* Main Content */}
          <div className={`lg:col-span-8 ${isRtl ? 'lg:order-2' : 'lg:order-1'}`}>
            {/* Search Results indicator */}
            {query && (
              <div className="mb-8 p-4 bg-surface-hover/30 border border-border rounded-xl flex items-center justify-between">
                <p className="text-body-sm text-text-muted">
                  {currentLang === 'ar' ? (
                    <>نتائج البحث عن <span className="text-text-primary font-bold">"{query}"</span></>
                  ) : currentLang === 'en' ? (
                    <>Results for <span className="text-text-primary font-bold">"{query}"</span></>
                  ) : (
                    <>Résultats pour <span className="text-text-primary font-bold">"{query}"</span></>
                  )}
                </p>
                <Link href={`/${currentLang}/blog`} className="text-caption text-primary hover:underline">
                  {currentLang === 'ar' ? 'مسح' : currentLang === 'en' ? 'Clear' : 'Effacer'}
                </Link>
              </div>
            )}

            {/* Articles Grid - Consistency is key */}
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts.map((post, index) => (
                  <div
                    key={post.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <ArticleCard post={post} priority={index < 2} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 card bg-surface-hover/30 border-dashed">
                <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4 scale-110 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                    <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                  </svg>
                </div>
                <p className="text-text-primary font-bold text-body-lg">
                  {currentLang === 'ar' ? 'لا توجد مقالات حالياً.' : 'Aucun article pour le moment.'}
                </p>
                <p className="text-text-muted text-body-sm mt-1">
                  {currentLang === 'ar' ? 'فريقنا يعمل بنشاط على إعداد محتوى جديد ومثير!' : 'Notre équipe prépare activement de nouveaux contenus passionnants !'}
                </p>
              </div>
            )}

            {/* Pagination Component */}
            <div className="mt-16">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath={`/${currentLang}/blog`}
              />
            </div>
          </div>

          {/* Sidebar - Enhanced styling */}
          <div className={`lg:col-span-4 mt-20 lg:mt-0 ${isRtl ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="sticky top-28">
              <BlogSidebar categories={categories} tags={tags} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
