'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, Search, Trash2, Mail } from 'lucide-react';
import Link from 'next/link';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch subscribers from Supabase
  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
      setFilteredSubscribers(data || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filter subscribers based on search term
  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (!term) {
      setFilteredSubscribers(subscribers);
    } else {
      setFilteredSubscribers(
        subscribers.filter((s) => s.email.toLowerCase().includes(term))
      );
    }
  }, [search, subscribers]);

  // Handle subscriber deletion
  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer ${email} de la liste ?`)) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update state
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error deleting subscriber:', err);
      alert('Une erreur est survenue lors de la suppression.');
    } finally {
      setDeletingId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (subscribers.length === 0) return;

    // Create CSV content
    const headers = ['ID', 'Email', 'Date d\'inscription'];
    const rows = subscribers.map((s) => [
      s.id,
      s.email,
      new Date(s.created_at).toLocaleString('fr-FR'),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + // UTF-8 BOM for Excel compatibility
      [headers.join(','), ...rows.map((r) => r.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `subscribers_eventzone_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-heading-lg text-text-primary">Abonnés Newsletter</h1>
          <p className="text-body-sm text-text-muted mt-1">Consultez, recherchez et exportez les adresses email collectées</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="btn-primary flex items-center gap-2 self-start sm:self-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          Exporter en CSV
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card p-6 flex items-center gap-4 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="w-12 h-12 rounded-2xl bg-primary-soft flex items-center justify-center text-primary">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-caption text-text-muted">Total des abonnés</p>
            <h3 className="font-heading font-bold text-heading text-text-primary">{subscribers.length}</h3>
          </div>
        </div>
      </div>

      {/* Main Table and Filter controls */}
      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher par adresse email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 text-body-sm w-full py-2.5"
            />
          </div>
          <span className="text-caption text-text-muted">
            {filteredSubscribers.length} de {subscribers.length} affiché(s)
          </span>
        </div>

        {/* Table layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <svg className="w-8 h-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-body-sm text-text-muted">Chargement des abonnés...</p>
          </div>
        ) : filteredSubscribers.length > 0 ? (
          <div className="table-container border border-border rounded-xl overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface-hover/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-caption font-semibold text-text-muted uppercase tracking-wider">
                    Adresse Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-caption font-semibold text-text-muted uppercase tracking-wider">
                    Date d&apos;inscription
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-caption font-semibold text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-surface-hover/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-body-sm font-medium text-text-primary">
                      {subscriber.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-body-sm text-text-secondary">
                      {new Date(subscriber.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-body-sm font-medium">
                      <button
                        onClick={() => handleDelete(subscriber.id, subscriber.email)}
                        disabled={deletingId === subscriber.id}
                        className="text-text-muted hover:text-danger p-2 rounded-lg hover:bg-danger-soft transition-all"
                        title="Supprimer l'abonné"
                      >
                        <Trash2 size={16} className={deletingId === subscriber.id ? 'animate-pulse' : ''} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-xl">
            <Mail className="mx-auto h-12 w-12 text-text-muted opacity-50 mb-3" />
            <h3 className="font-heading font-bold text-body-lg text-text-primary">Aucun abonné trouvé</h3>
            <p className="text-body-sm text-text-muted mt-1">
              {search ? 'Modifiez vos critères de recherche.' : 'Aucun utilisateur ne s\'est encore inscrit à votre newsletter.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
