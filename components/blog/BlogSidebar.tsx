'use client';

import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BlogSidebarProps {
  categories: string[];
  tags: string[];
}

export default function BlogSidebar({ categories, tags }: BlogSidebarProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) throw error;

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Subscription error:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <aside className="space-y-8">
      {/* Categories */}
      {categories.length > 0 && (
        <div className="card p-6">
          <h3 className="font-heading font-bold text-heading-sm text-text-primary mb-4">
            Catégories
          </h3>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/blog/category/${encodeURIComponent(category)}`}
                  className="flex items-center gap-2 py-1.5 text-body-sm text-text-secondary hover:text-primary transition-colors group"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted group-hover:text-primary transition-colors">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Tags */}
      {tags.length > 0 && (
        <div className="card p-6">
          <h3 className="font-heading font-bold text-heading-sm text-text-primary mb-4">
            Tags populaires
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="badge-muted hover:border-primary/30 hover:text-primary transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="card p-6 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-heading-sm text-text-primary mb-2">
          {status === 'success' ? 'Merci !' : 'Recevez nos guides'}
        </h3>
        <p className="text-body-sm text-text-muted mb-4">
          {status === 'success'
            ? 'Vous êtes maintenant inscrit à notre newsletter.'
            : 'Les meilleures pratiques pour organiser vos événements, directement dans votre inbox.'}
        </p>

        {status !== 'success' && (
          <form className="space-y-3" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input text-body-sm"
              required
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className="btn-primary w-full text-body-sm disabled:opacity-50"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Inscription...' : "S'abonner"}
            </button>
            {status === 'error' && (
              <p className="text-caption text-danger mt-2">Une erreur est survenue. Veuillez réessayer.</p>
            )}
          </form>
        )}
      </div>
    </aside>
  );
}

