'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Post, PostFormData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { generateSlug } from '@/lib/slugify';
import { calculateReadingTime } from '@/lib/reading-time';
import RichEditor from '@/components/admin/RichEditor';
import ImageUpload from '@/components/admin/ImageUpload';
import SEOScorePanel from '@/components/admin/SEOScorePanel';
import SERPPreview from '@/components/admin/SERPPreview';
import OGPreview from '@/components/admin/OGPreview';
import TagInput from '@/components/shared/TagInput';

interface PostEditorProps {
  post?: Post; // if editing
}

const defaultForm: PostFormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image_url: '',
  cover_image_alt: '',
  author_name: 'Mohamed',
  author_avatar_url: '',
  category: '',
  tags: [],
  lang: 'fr',
  status: 'draft',
  published_at: '',
  scheduled_at: '',
  seo_title: '',
  seo_description: '',
  canonical_url: '',
  og_image_url: '',
  cta_type: 'none',
  cta_phone: '',
};

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormData>(
    post
      ? {
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        cover_image_url: post.cover_image_url || '',
        cover_image_alt: post.cover_image_alt || '',
        author_name: post.author_name || 'Mohamed',
        author_avatar_url: post.author_avatar_url || '',
        category: post.category || '',
        tags: post.tags || [],
        lang: post.lang || 'fr',
        status: post.status || 'draft',
        published_at: post.published_at || '',
        scheduled_at: post.scheduled_at || '',
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        canonical_url: post.canonical_url || '',
        og_image_url: post.og_image_url || '',
        cta_type: post.cta_type || 'none',
        cta_phone: post.cta_phone || '',
      }
      : defaultForm
  );

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!post);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && form.title) {
      setForm((f) => ({ ...f, slug: generateSlug(f.title) }));
    }
  }, [form.title, slugManuallyEdited]);

  // Auto-fill SEO title from title
  useEffect(() => {
    if (!form.seo_title && form.title) {
      setForm((f) => ({ ...f, seo_title: f.title }));
    }
  }, [form.title]);

  // Auto-fill SEO description from excerpt
  useEffect(() => {
    if (!form.seo_description && form.excerpt) {
      setForm((f) => ({ ...f, seo_description: f.excerpt }));
    }
  }, [form.excerpt]);

  const set = (updates: Partial<PostFormData>) => {
    setForm((f) => ({ ...f, ...updates }));
  };

  const readingTime = calculateReadingTime(form.content, form.lang);

  const savePost = useCallback(
    async (status?: 'draft' | 'published' | 'scheduled') => {
      setSaving(true);
      setSaveStatus('idle');

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      const author_name = user?.user_metadata?.name || form.author_name;
      const author_avatar_url = user?.user_metadata?.avatar || user?.user_metadata?.avatar_url || form.author_avatar_url;

      const payload = {
        ...form,
        author_name,
        author_avatar_url,
        status: status || form.status,
        reading_time_minutes: readingTime,
        seo_title: form.seo_title || form.title,
        seo_description: form.seo_description || form.excerpt,
        published_at:
          (status || form.status) === 'published' && !form.published_at
            ? new Date().toISOString()
            : form.published_at || null,
        scheduled_at: form.scheduled_at || null,
        canonical_url: form.canonical_url || null,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (post) {
        ({ error } = await supabase.from('posts').update(payload).eq('id', post.id));
      } else {
        const { error: insertError, data } = await supabase
          .from('posts')
          .insert(payload)
          .select('id')
          .single();
        error = insertError;
        if (!error && data) {
          router.replace(`/admin/posts/${data.id}/edit`);
        }
      }

      if (error) {
        setSaveStatus('error');
        console.error(error);
      } else {
        setSaveStatus('saved');
        if (status) set({ status });
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
      setSaving(false);
    },
    [form, post, readingTime, router]
  );

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!post) return;
    const interval = setInterval(() => {
      if (form.status === 'draft') savePost();
    }, 30000);
    return () => clearInterval(interval);
  }, [form, post, savePost]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); savePost(); }} className="flex gap-8 items-start min-h-0">
      {/* ========== LEFT COLUMN — CONTENT (70%) ========== */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Title */}
        <div>
          <textarea
            value={form.title}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Titre de l'article..."
            rows={2}
            className="w-full bg-transparent border-none outline-none text-display-sm font-heading font-bold text-text-primary placeholder:text-text-muted resize-none"
            required
          />
          {/* Slug row */}
          <div className="flex items-center gap-2 mt-1 px-1">
            <span className="text-caption text-text-muted">/blog/</span>
            <input
              value={form.slug}
              onChange={(e) => { set({ slug: e.target.value }); setSlugManuallyEdited(true); }}
              className="flex-1 text-caption text-primary bg-transparent border-none outline-none"
              placeholder="slug-de-l-article"
            />
          </div>
        </div>

        {/* Rich Editor */}
        <RichEditor content={form.content} onChange={(html) => set({ content: html })} />

        {/* Excerpt */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-body-sm font-medium text-text-secondary">
              Extrait / Méta-description
            </label>
            <span className={`text-caption ${form.excerpt.length > 160 ? 'text-danger' : form.excerpt.length >= 130 ? 'text-success' : 'text-text-muted'}`}>
              {form.excerpt.length}/160
            </span>
          </div>
          <textarea
            value={form.excerpt}
            onChange={(e) => set({ excerpt: e.target.value })}
            rows={3}
            maxLength={200}
            placeholder="Un résumé accrocheur de 130–160 caractères..."
            className="textarea"
          />
        </div>

        {/* Cover Image */}
        <div>
          <ImageUpload
            label="Image de couverture"
            value={form.cover_image_url}
            onChange={(url) => set({ cover_image_url: url })}
            hint="Taille recommandée : 1200×675px"
          />
          <div className="mt-3">
            <label className="block text-body-sm font-medium text-text-secondary mb-2">
              Texte alternatif (ALT) <span className="text-danger">*</span>
            </label>
            <input
              value={form.cover_image_alt}
              onChange={(e) => set({ cover_image_alt: e.target.value })}
              placeholder="Description de l'image pour l'accessibilité..."
              className="input"
            />
          </div>
        </div>

        {/* Call to Action (CTA) */}
        <div className="card p-5 space-y-4">
          <h3 className="font-heading font-semibold text-body text-text-primary">Call to Action (CTA)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-2">Type de bouton</label>
              <select
                value={form.cta_type}
                onChange={(e) => set({ cta_type: e.target.value as PostFormData['cta_type'] })}
                className="input"
              >
                <option value="none">Aucun CTA</option>
                <option value="call">Bouton &quot;Call Us Now&quot;</option>
                <option value="demo">Bouton &quot;Book a Demo&quot;</option>
              </select>
            </div>
            {form.cta_type === 'call' && (
              <div>
                <label className="block text-body-sm font-medium text-text-secondary mb-2">Numéro de téléphone</label>
                <input
                  value={form.cta_phone}
                  onChange={(e) => set({ cta_phone: e.target.value })}
                  className="input"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            )}
            {form.cta_type === 'demo' && (
              <div>
                <label className="block text-body-sm font-medium text-text-secondary mb-2">Lien de la démo</label>
                <p className="text-body-sm text-text-muted mt-2">Le Calendly standard Eventzone sera utilisé.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========== RIGHT COLUMN — SETTINGS (30%) ========== */}
      <aside className="w-80 xl:w-96 flex-shrink-0 space-y-5 sticky top-8">
        {/* Save status */}
        {saveStatus !== 'idle' && (
          <div className={`px-4 py-3 rounded-xl text-body-sm animate-fade-in ${saveStatus === 'saved' ? 'bg-success-soft text-success border border-success/20' : 'bg-danger-soft text-danger border border-danger/20'}`}>
            {saveStatus === 'saved' ? '✓ Sauvegardé avec succès' : '✗ Erreur lors de la sauvegarde'}
          </div>
        )}

        {/* ── PUBLISH SETTINGS ── */}
        <div className="card p-5 space-y-4">
          <h3 className="font-heading font-semibold text-body text-text-primary border-b border-border pb-3">
            Publication
          </h3>

          {/* Status */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">Statut</label>
            <select
              value={form.status}
              onChange={(e) => set({ status: e.target.value as PostFormData['status'] })}
              className="input"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="scheduled">Planifié</option>
            </select>
          </div>

          {/* Scheduled date */}
          {form.status === 'scheduled' && (
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-2">Date de publication</label>
              <input type="datetime-local" value={form.scheduled_at} onChange={(e) => set({ scheduled_at: e.target.value })} className="input" />
            </div>
          )}

          {/* Language */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">Langue</label>
            <div className="flex gap-2">
              {(['fr', 'en', 'ar'] as const).map((lang) => (
                <button key={lang} type="button" onClick={() => set({ lang })}
                  className={`flex-1 py-2 rounded-xl text-body-sm font-medium border transition-all ${form.lang === lang ? 'bg-primary text-white border-primary' : 'border-border text-text-muted hover:border-primary/50'}`}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">Catégorie</label>
            <select
              value={form.category}
              onChange={(e) => set({ category: e.target.value })}
              className="input cursor-pointer"
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Guides">Guides</option>
              <option value="Actualités">Actualités</option>
              <option value="Études de cas">Études de cas</option>
              <option value="Technologie">Technologie</option>
              <option value="Expertise">Expertise</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">Tags</label>
            <TagInput tags={form.tags} onChange={(tags) => set({ tags })} />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button type="button" onClick={() => savePost('draft')} disabled={saving}
              className="btn-secondary w-full disabled:opacity-50">
              {saving ? 'Sauvegarde...' : 'Sauvegarder le brouillon'}
            </button>
            <button type="button" onClick={() => savePost('published')} disabled={saving}
              className="btn-primary w-full disabled:opacity-50">
              {saving ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </div>

        {/* ── SEO ── */}
        <div className="card p-5 space-y-5">
          <h3 className="font-heading font-semibold text-body text-text-primary border-b border-border pb-3">
            SEO & Méta-données
          </h3>

          {/* SERP Preview */}
          <SERPPreview
            title={form.seo_title || form.title}
            description={form.seo_description || form.excerpt}
            slug={form.slug}
          />

          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">Titre SEO</label>
            <input value={form.seo_title} onChange={(e) => set({ seo_title: e.target.value })} className="input" placeholder="Titre optimisé SEO (max 60 car.)" maxLength={70} />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">Description SEO</label>
            <textarea value={form.seo_description} onChange={(e) => set({ seo_description: e.target.value })} rows={3} className="textarea" placeholder="Description optimisée SEO (max 160 car.)" maxLength={180} />
          </div>

          <div>
            <label className="block text-body-sm font-medium text-text-secondary mb-2">URL Canonique <span className="text-text-muted">(optionnel)</span></label>
            <input value={form.canonical_url} onChange={(e) => set({ canonical_url: e.target.value })} className="input" placeholder="https://..." />
          </div>
        </div>

        {/* ── OG ── */}
        <div className="card p-5 space-y-4">
          <h3 className="font-heading font-semibold text-body text-text-primary border-b border-border pb-3">
            Open Graph
          </h3>
          <OGPreview
            title={form.seo_title || form.title}
            description={form.seo_description || form.excerpt}
            imageUrl={form.og_image_url}
          />
          <ImageUpload
            label="Image OG"
            value={form.og_image_url}
            onChange={(url) => set({ og_image_url: url })}
            aspectRatio="1200/630"
            hint="1200×630px recommandé"
          />
        </div>

        {/* ── SEO SCORE ── */}
        <div className="card p-5">
          <h3 className="font-heading font-semibold text-body text-text-primary border-b border-border pb-3 mb-4">
            Score SEO
          </h3>
          <SEOScorePanel
            seoTitle={form.seo_title || form.title}
            seoDescription={form.seo_description || form.excerpt}
            coverImageAlt={form.cover_image_alt}
            content={form.content}
            slug={form.slug}
            readingTime={readingTime}
            ogImageUrl={form.og_image_url}
          />
        </div>
      </aside>
    </form>
  );
}
