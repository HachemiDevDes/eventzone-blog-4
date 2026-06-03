import { createStaticSupabaseClient } from '@/lib/supabase-server';
import { Post } from '@/lib/types';
import AnalyticsDashboard from './AnalyticsDashboard';

export const revalidate = 0;

async function getAnalyticsData() {
  const supabase = createStaticSupabaseClient();
  
  // 1. Fetch all posts for summary and category data
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published');

  // 2. Fetch views over time (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { data: timelineData } = await supabase
    .from('post_views')
    .select('viewed_at, count')
    .gte('viewed_at', thirtyDaysAgo.toISOString())
    .order('viewed_at', { ascending: true });

  return {
    posts: (posts as Post[]) || [],
    timeline: timelineData || [],
  };
}

export default async function AnalyticsPage() {
  const { posts, timeline } = await getAnalyticsData();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-heading font-extrabold text-text-primary tracking-tight">
            Analyses & Performances
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Suivez l'engagement de votre audience et l'efficacité de vos appels à l'action.
          </p>
        </div>
      </div>

      <AnalyticsDashboard initialPosts={posts} timeline={timeline} />
    </div>
  );
}
