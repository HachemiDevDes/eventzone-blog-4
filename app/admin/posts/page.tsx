import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Post } from '@/lib/types';
import PostsTable from '@/components/admin/PostsTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPosts() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as Post[]) || [];
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-heading-lg text-text-primary">Gestion des Articles</h1>
          <p className="text-body-sm text-text-muted mt-1">Créez, modifiez et organisez vos contenus</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvel article
        </Link>
      </div>

      {/* Posts Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-heading-sm text-text-primary">Tous les articles</h2>
          <span className="badge-muted">{posts.length} articles</span>
        </div>
        <PostsTable posts={posts} />
      </div>
    </div>
  );
}
