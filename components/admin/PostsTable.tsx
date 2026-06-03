'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Post } from '@/lib/types';
import StatusBadge from '@/components/shared/StatusBadge';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PostsTableProps {
  posts: Post[];
}

const langLabels: Record<string, string> = { fr: 'FR', ar: 'AR', en: 'EN' };

export default function PostsTable({ posts: initialPosts }: PostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [sortKey, setSortKey] = useState<keyof Post>('published_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Post | null>(null);

  const handleSort = (key: keyof Post) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...posts].sort((a, b) => {
    const av = a[sortKey] ?? '';
    const bv = b[sortKey] ?? '';
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const post = confirmDelete;
    setDeleting(post.id);
    setConfirmDelete(null);

    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } else {
      alert("Erreur lors de la suppression. Veuillez réessayer.");
    }
    setDeleting(null);
  };

  const SortIcon = ({ col }: { col: keyof Post }) => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      className={`ml-1 transition-transform ${sortKey === col && sortDir === 'asc' ? 'rotate-180' : ''} ${sortKey === col ? 'text-primary' : 'text-text-muted'}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  return (
    <>
      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative card w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-danger-soft flex items-center justify-center text-danger mb-6 mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
            </div>
            <h3 className="text-display-xs font-heading font-bold text-center text-text-primary mb-2">Supprimer l'article ?</h3>
            <p className="text-body-sm text-text-muted text-center mb-8">
              Vous êtes sur le point de supprimer <span className="font-bold text-text-primary">"{confirmDelete.title}"</span>. Cette action est irréversible.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setConfirmDelete(null)}
                className="btn-secondary"
              >
                Annuler
              </button>
              <button 
                onClick={handleDelete}
                className="btn bg-danger text-white hover:bg-danger-hover shadow-glow-danger"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {[
                  { key: 'title', label: 'Titre' },
                  { key: 'status', label: 'Statut' },
                  { key: 'category', label: 'Catégorie' },
                  { key: 'lang', label: 'Langue' },
                  { key: 'views', label: 'Vues' },
                  { key: 'cta_clicks', label: 'Clicks CTA' },
                  { key: 'published_at', label: 'Publié le' },
                ].map(({ key, label }) => (
                  <th key={key}>
                    <button onClick={() => handleSort(key as keyof Post)}
                      className="flex items-center text-caption text-text-muted uppercase tracking-wider hover:text-text-primary transition-colors">
                      {label}<SortIcon col={key as keyof Post} />
                    </button>
                  </th>
                ))}
                <th><span className="text-caption text-text-muted uppercase tracking-wider">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((post) => (
                <tr key={post.id} className={deleting === post.id ? 'opacity-30' : ''}>
                  <td className="min-w-[220px] max-w-[300px]">
                    <Link href={`/admin/posts/${post.id}/edit`}
                      className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-1">
                      {post.title}
                    </Link>
                  </td>
                  <td><StatusBadge status={post.status} /></td>
                  <td>
                    {post.category ? (
                      <span className="badge-muted">{post.category}</span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td>
                    <span className="badge-muted font-mono">{langLabels[post.lang] || post.lang}</span>
                  </td>
                  <td>
                    <span className="font-medium text-text-primary">{post.views.toLocaleString('fr-FR')}</span>
                  </td>
                  <td>
                    <span className="font-medium text-primary-hover">{(post.cta_clicks || 0).toLocaleString('fr-FR')}</span>
                  </td>
                  <td>
                    <span className="text-text-muted">
                      {post.published_at
                        ? format(new Date(post.published_at), 'd MMM yyyy', { locale: fr })
                        : '—'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`}
                        className="btn-secondary py-1.5 px-3 text-caption">
                        Modifier
                      </Link>
                      <Link href={`/blog/${post.slug}`} target="_blank"
                        className="btn-secondary py-1.5 px-3 text-caption">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 01-2-2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </Link>
                      <button onClick={() => setConfirmDelete(post)}
                        disabled={deleting === post.id}
                        className="btn bg-danger/10 text-danger hover:bg-danger hover:text-white py-1.5 px-3 text-caption transition-all disabled:opacity-50">
                        {deleting === post.id ? '...' : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && (
            <div className="py-16 text-center text-text-muted">
              Aucun article trouvé.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
