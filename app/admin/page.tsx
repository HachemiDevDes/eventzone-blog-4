import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Post } from '@/lib/types';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatsCard from '@/components/admin/StatsCard';
import PostsTable from '@/components/admin/PostsTable';
import ViewsChart from '@/components/admin/ViewsChart';
import Link from 'next/link';

import SubscribersTable from '@/components/admin/SubscribersTable';
import { Subscriber } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const supabase = createServerSupabaseClient();

  const [
    { data: posts },
    { data: viewsData },
    { data: monthlyViews },
    { data: subscribers },
  ] = await Promise.all([
    supabase.from('posts').select('*').order('created_at', { ascending: false }),
    supabase
      .from('post_views')
      .select('viewed_at, count')
      .gte('viewed_at', format(subDays(new Date(), 30), 'yyyy-MM-dd')),
    supabase
      .from('post_views')
      .select('count')
      .gte('viewed_at', format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')),
    supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
  ]);

  const allPosts = (posts as Post[]) || [];
  const publishedPosts = allPosts.filter((p) => p.status === 'published');
  const totalViews = allPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const thisMonthViews = (monthlyViews || []).reduce((sum: number, v: { count: number }) => sum + (v.count || 0), 0);
  const topPost = [...publishedPosts].sort((a, b) => b.views - a.views)[0] || null;
  const drafts = allPosts.filter((p) => p.status === 'draft').length;
  const allSubscribers = (subscribers as Subscriber[]) || [];

  // Build 30-day chart data
  const viewsByDate: Record<string, number> = {};
  (viewsData || []).forEach((v: { viewed_at: string; count: number }) => {
    viewsByDate[v.viewed_at] = (viewsByDate[v.viewed_at] || 0) + v.count;
  });

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), 29 - i), 'dd MMM', { locale: fr });
    const key = format(subDays(new Date(), 29 - i), 'yyyy-MM-dd');
    return { date, views: viewsByDate[key] || 0 };
  });

  return { allPosts, publishedPosts, totalViews, thisMonthViews, topPost, drafts, chartData, allSubscribers };
}

export default async function AdminDashboardPage() {
  const { allPosts, publishedPosts, totalViews, thisMonthViews, topPost, drafts, chartData, allSubscribers } =
    await getDashboardData();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-heading-lg text-text-primary">Tableau de bord</h1>
          <p className="text-body-sm text-text-muted mt-1">Vue d&apos;ensemble du blog Eventzone</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvel article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
        <StatsCard
          label="Articles"
          value={publishedPosts.length}
          accent="primary"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
        />
        <StatsCard
          label="Abonnés"
          value={allSubscribers.length}
          accent="warning"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
        />
        <StatsCard
          label="Vues totales"
          value={totalViews}
          accent="success"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
        />
        <StatsCard
          label="Ce mois"
          value={thisMonthViews}
          accent="primary"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
        />
        <StatsCard
          label="Meilleur"
          value={topPost ? topPost.views : '—'}
          accent="warning"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
        />
        <StatsCard
          label="Brouillons"
          value={drafts}
          accent="danger"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>}
        />
      </div>

      {/* Top post detail */}
      {topPost && (
        <div className="card p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-caption text-text-muted">Article le plus populaire</p>
            <p className="font-medium text-body-sm text-text-primary truncate">{topPost.title}</p>
          </div>
          <Link href={`/admin/posts/${topPost.id}/edit`} className="btn-secondary py-1.5 px-4 text-caption flex-shrink-0">
            Modifier
          </Link>
        </div>
      )}

      {/* Views Chart */}
      <ViewsChart data={chartData} />

      {/* Subscribers Table Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-heading-sm text-text-primary">Tous les articles</h2>
            <span className="badge-muted">{allPosts.length}</span>
          </div>
          <PostsTable posts={allPosts} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-heading-sm text-text-primary">Abonnés récents</h2>
            <span className="badge-muted">{allSubscribers.length}</span>
          </div>
          <SubscribersTable subscribers={allSubscribers.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
}
