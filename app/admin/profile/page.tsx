'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

import ImageUpload from '@/components/admin/ImageUpload';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (user) {
          setEmail(user.email || '');
          setName(user.user_metadata?.name || '');
          setAvatar(user.user_metadata?.avatar || user.user_metadata?.avatar_url || '');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updates: Record<string, unknown> = {};
      
      // Update email if changed
      if (email) updates.email = email;
      
      // Update password if provided
      if (password) updates.password = password;
      
      // Update metadata (name and avatar)
      updates.data = { 
        name,
        avatar 
      };

      const { error } = await supabase.auth.updateUser(updates);

      if (error) throw error;

      setSuccess('Profil mis à jour avec succès');
      setPassword(''); // Clear password field after success
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-heading font-bold text-text-primary mb-8">Mon Profil</h1>
        <div className="skeleton w-full h-12"></div>
        <div className="skeleton w-full h-32"></div>
        <div className="skeleton w-full h-12"></div>
        <div className="skeleton w-full h-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-heading font-bold text-text-primary mb-8">Mon Profil</h1>
      
      <div className="card p-6 md:p-8">
        <form onSubmit={handleUpdate} className="space-y-6">
          {error && (
            <div className="p-4 bg-danger-soft text-danger rounded-xl text-body-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-success-soft text-success rounded-xl text-body-sm">
              {success}
            </div>
          )}

          <div className="space-y-2 max-w-sm">
            <ImageUpload
              label="Photo de profil"
              value={avatar}
              onChange={setAvatar}
              aspectRatio="1/1"
              hint="Format carré recommandé (ex: 400x400px)"
            />
          </div>

          <div className="space-y-2">
            <label className="text-body-sm font-medium text-text-secondary" htmlFor="name">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Votre nom"
            />
          </div>

          <div className="space-y-2">
            <label className="text-body-sm font-medium text-text-secondary" htmlFor="email">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="votre@email.com"
              required
            />
            <p className="text-caption text-text-muted mt-1">
              La modification de l&apos;e-mail nécessitera une confirmation.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-body-sm font-medium text-text-secondary" htmlFor="password">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Laissez vide pour conserver l'actuel"
              minLength={6}
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
