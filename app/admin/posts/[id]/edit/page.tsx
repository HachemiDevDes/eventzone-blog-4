import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Post } from '@/lib/types';
import PostEditor from '@/components/admin/PostEditor';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getPost(id: string): Promise<Post | null> {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase.from('posts').select('*').eq('id', id).single();
  return data as Post | null;
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  if (!post) notFound();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-heading-lg text-text-primary">Modifier l&apos;article</h1>
          <p className="text-body-sm text-text-muted mt-1 truncate max-w-lg">{post.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/posts/${post.id}/analytics`} className="btn-secondary text-body-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
            </svg>
            Analytiques
          </Link>
          {post.status === 'published' && (
            <Link href={`/blog/${post.slug}`} target="_blank" className="btn-secondary text-body-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Voir l&apos;article
            </Link>
          )}
        </div>
      </div>
      <PostEditor post={post} />
    </div>
  );
}
