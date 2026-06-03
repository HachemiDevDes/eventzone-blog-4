'use client';

import { Subscriber } from '@/lib/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SubscribersTableProps {
  subscribers: Subscriber[];
}

export default function SubscribersTable({ subscribers }: SubscribersTableProps) {
  if (subscribers.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h3 className="font-heading font-semibold text-body-lg text-text-primary mb-1">
          Aucun abonné
        </h3>
        <p className="text-body-sm text-text-muted max-w-xs mx-auto">
          Les personnes qui s&#39;abonnent à la newsletter apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="table-container">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th scope="col">Email</th>
              <th scope="col">Date d&#39;inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-surface-hover transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center text-primary font-bold text-caption uppercase">
                      {subscriber.email[0]}
                    </div>
                    <span className="font-medium text-text-primary">{subscriber.email}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-text-secondary text-body-sm">
                  {format(new Date(subscriber.created_at), 'd MMMM yyyy HH:mm', { locale: fr })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
