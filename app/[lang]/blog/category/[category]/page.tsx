import { Metadata } from 'next';
import { createStaticSupabaseClient } from '@/lib/supabase-server';
import { Post } from '@/lib/types';
import ArticleCard from '@/components/blog/ArticleCard';
import Pagination from '@/components/blog/Pagination';
import Breadcrumbs from '@/components/blog/Breadcrumbs';

export const revalidate = 3600;
const POSTS_PER_PAGE = 6;

export async function generateMetadata({
  params,
}: {
  params: { category: string; lang: string };
}): Promise<Metadata> {
  const category = decodeURIComponent(params.category);
  return {
    title: `${category} | Eventzone Blog`,
    description: `Découvrez nos articles sur le thème "${category}" — guides et ressources pour les professionnels de l'événementiel.`,
    openGraph: {
      title: `${category} — Eventzone Blog`,
      description: `Articles et guides sur ${category}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { category: string; lang: string };
  searchParams: { page?: string };
}) {
  const currentLang = params.lang || 'fr';
  const category = decodeURIComponent(params.category);
  const page = parseInt(searchParams.page || '1', 10);
  const supabase = createStaticSupabaseClient();

  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts, count } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image_url, cover_image_alt, category, lang, published_at, created_at, reading_time_minutes, author_name, author_avatar_url', { count: 'exact' })
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  const isRtl = currentLang === 'ar';

  return (
    <section className={`max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-8 ${isRtl ? 'font-arabic' : ''}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <Breadcrumbs
        items={[
          { label: 'Blog', href: `/${currentLang}/blog` },
          { label: category },
        ]}
      />

      <div className="mb-10">
        <span className="badge-primary mb-3 inline-block">{category}</span>
        <h1 className="font-heading font-extrabold text-display-sm text-text-primary">
          {category}
        </h1>
        <p className="text-body-lg text-text-muted mt-2">
          {count || 0} article{(count || 0) > 1 ? 's' : ''} dans cette catégorie
        </p>
      </div>

      {(posts as Post[])?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(posts as Post[]).map((post, index) => (
            <div
              key={post.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ArticleCard post={post} currentLang={currentLang} priority={index < 3} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-muted text-body-lg">
            Aucun article dans cette catégorie.
          </p>
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/${currentLang}/blog/category/${encodeURIComponent(category)}`}
      />
    </section>
  );
}
