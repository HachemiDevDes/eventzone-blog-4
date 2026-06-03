'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Une erreur inattendue est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="mb-6">
            <img 
              src="https://images2.imgbox.com/02/39/OksF9irW_o.png" 
              alt="Eventzone" 
              className="h-14 w-auto mx-auto object-contain dark:brightness-0 dark:invert"
            />
          </div>
          <h1 className="font-heading font-bold text-heading-lg text-text-primary">
            Eventzone Admin
          </h1>
          <p className="text-body-sm text-text-muted mt-1">
            Connectez-vous pour accéder au tableau de bord
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          className="card p-8 animate-fade-in-up animate-delay-100"
        >
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-danger-soft border border-danger/20 text-danger text-body-sm animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-text-secondary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@eventzone.pro"
                required
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-body-sm font-medium text-text-secondary mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-body disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-caption text-text-muted mt-6">
          © {new Date().getFullYear()} Eventzone — Administration
        </p>
      </div>
    </div>
  );
}
