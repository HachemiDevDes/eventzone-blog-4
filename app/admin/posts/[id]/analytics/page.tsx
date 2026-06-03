import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Post } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import ViewsChart from '@/components/admin/ViewsChart';

export const dynamic = 'force-dynamic';

async function getPostAnalytics(id: string) {
  const supabase = createServerSupabaseClient();

  const [{ data: post }, { data: viewsData }] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).single(),
    supabase
      .from('post_views')
      .select('viewed_at, count')
      .eq('post_id', id)
      .gte('viewed_at', format(subDays(new Date(), 30), 'yyyy-MM-dd'))
      .order('viewed_at', { ascending: true }),
  ]);

  if (!post) return null;

  const viewsByDate: Record<string, number> = {};
  (viewsData || []).forEach((v: { viewed_at: string; count: number }) => {
    viewsByDate[v.viewed_at] = v.count;
  });

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'dd MMM', { locale: fr });
    const key = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
    return { date, views: viewsByDate[key] || 0 };
  });

  return { post: post as Post, chartData };
}

export default async function PostAnalyticsPage({ params }: { params: { id: string } }) {
  const result = await getPostAnalytics(params.id);
  if (!result) notFound();
  const { post, chartData } = result;

  const last30Views = chartData.reduce((sum, d) => sum + d.views, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/posts/${post.id}/edit`}
            className="text-caption text-text-muted hover:text-primary transition-colors flex items-center gap-1 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
            Retour à l&apos;éditeur
          </Link>
          <h1 className="font-heading font-bold text-heading-lg text-text-primary">Analytiques</h1>
          <p className="text-body-sm text-text-muted mt-1 max-w-xl truncate">{post.title}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <p className="text-caption text-text-muted mb-2">Vues totales (tout le temps)</p>
          <p className="font-heading font-bold text-display-sm text-primary">{post.views.toLocaleString('fr-FR')}</p>
        </div>
        <div className="card p-6">
          <p className="text-caption text-text-muted mb-2">Vues — 30 derniers jours</p>
          <p className="font-heading font-bold text-display-sm text-text-primary">{last30Views.toLocaleString('fr-FR')}</p>
        </div>
        <div className="card p-6">
          <p className="text-caption text-text-muted mb-2">Temps de lecture estimé</p>
          <p className="font-heading font-bold text-display-sm text-text-primary">{post.reading_time_minutes} min</p>
        </div>
      </div>

      {/* Chart */}
      <ViewsChart data={chartData} />

      {/* Meta info */}
      <div className="card p-6">
        <h3 className="font-heading font-semibold text-body text-text-primary mb-4">Informations de l&apos;article</h3>
        <dl className="grid grid-cols-2 gap-y-3 gap-x-8 text-body-sm">
          <dt className="text-text-muted">Statut</dt>
          <dd className="text-text-secondary font-medium">{post.status === 'published' ? 'Publié' : post.status === 'draft' ? 'Brouillon' : 'Planifié'}</dd>
          <dt className="text-text-muted">Catégorie</dt>
          <dd className="text-text-secondary">{post.category || '—'}</dd>
          <dt className="text-text-muted">Langue</dt>
          <dd className="text-text-secondary">{post.lang.toUpperCase()}</dd>
          <dt className="text-text-muted">Créé le</dt>
          <dd className="text-text-secondary">{format(new Date(post.created_at), 'd MMM yyyy', { locale: fr })}</dd>
          <dt className="text-text-muted">Publié le</dt>
          <dd className="text-text-secondary">{post.published_at ? format(new Date(post.published_at), 'd MMM yyyy', { locale: fr }) : '—'}</dd>
          <dt className="text-text-muted">Slug</dt>
          <dd className="text-primary font-mono text-caption">/blog/{post.slug}</dd>
        </dl>
      </div>
    </div>
  );
}
