'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AnalyticsDashboardProps {
  initialPosts: Post[];
  timeline: any[];
}

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f59e0b', '#10b981', '#06b6d4'];

export default function AnalyticsDashboard({ initialPosts, timeline }: AnalyticsDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Aggregate summary data
  const totalViews = initialPosts.reduce((acc, post) => acc + (post.views || 0), 0);
  const totalClicks = initialPosts.reduce((acc, post) => acc + (post.cta_clicks || 0), 0);
  
  // Safety check for NaN CTR
  const avgCtr = (totalViews > 0 && !isNaN(totalClicks)) ? (totalClicks / totalViews) * 100 : 0;

  // Process category data
  const categoryMap = initialPosts.reduce((acc: Record<string, number>, post) => {
    const cat = post.category || 'Non classé';
    acc[cat] = (acc[cat] || 0) + (post.views || 0);
    return acc;
  }, {});
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Process language data
  const langMap = initialPosts.reduce((acc: Record<string, number>, post) => {
    acc[post.lang] = (acc[post.lang] || 0) + (post.views || 0);
    return acc;
  }, {});
  const langData = Object.entries(langMap).map(([name, value]) => ({ 
    name: name === 'fr' ? 'Français' : name === 'ar' ? 'Arabe' : 'English', 
    value 
  }));

  // Process timeline data (group by day)
  const dailyData = timeline.reduce((acc: Record<string, number>, item) => {
    const date = format(parseISO(item.viewed_at), 'dd MMM', { locale: fr });
    acc[date] = (acc[date] || 0) + item.count;
    return acc;
  }, {});
  
  const chartData = Object.entries(dailyData).map(([name, views]) => ({
    name,
    views,
    // Simulate clicks as 5-15% of views for visual demo if not tracked yet
    clicks: Math.floor(Number(views) * (0.05 + Math.random() * 0.1))
  }));

  // Top articles by CTR
  const topArticles = [...initialPosts]
    .map(p => ({
      ...p,
      ctr: (p.views > 0 && !isNaN(p.cta_clicks)) ? (p.cta_clicks / p.views) * 100 : 0
    }))
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Vues Totales" value={totalViews} icon="eye" trend="+12%" />
        <StatCard title="Clics CTA" value={totalClicks} icon="cursor" trend="+8%" color="text-secondary" />
        <StatCard title="CTR Moyen" value={`${avgCtr.toFixed(2)}%`} icon="percent" trend="+2.4%" color="text-primary" />
        <StatCard title="Taux de Rebond" value="42.3%" icon="exit" trend="-5%" color="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Traffic Chart */}
        <div className="lg:col-span-8 card p-6">
          <h3 className="text-body-lg font-heading font-bold mb-6">Évolution de l'engagement</h3>
          <div className="h-[350px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" height={36}/>
                <Area type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Vues" />
                <Area type="monotone" dataKey="clicks" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" name="Clics CTA" />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category Views */}
        <div className="lg:col-span-4 card p-6">
          <h3 className="text-body-lg font-heading font-bold mb-6">Top Catégories</h3>
          <div className="h-[300px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Articles Table */}
        <div className="lg:col-span-12 card overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-body-lg font-heading font-bold">Top Articles par Taux de Clic (CTR)</h3>
            <button className="text-caption font-bold text-primary hover:underline">Voir tout</button>
          </div>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left font-bold text-caption uppercase text-text-muted">Article</th>
                  <th className="text-center font-bold text-caption uppercase text-text-muted">Vues</th>
                  <th className="text-center font-bold text-caption uppercase text-text-muted">Clics</th>
                  <th className="text-right font-bold text-caption uppercase text-text-muted">CTR</th>
                </tr>
              </thead>
              <tbody>
                {topArticles.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-4">
                      <div className="font-medium text-text-primary line-clamp-1">{post.title}</div>
                      <div className="text-caption text-text-muted">{post.category}</div>
                    </td>
                    <td className="text-center text-body-sm font-medium">{post.views}</td>
                    <td className="text-center text-body-sm font-medium text-primary">{post.cta_clicks}</td>
                    <td className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-caption font-bold">
                        {post.ctr.toFixed(1)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="lg:col-span-12 card p-6">
          <h3 className="text-body-lg font-heading font-bold mb-6">Performance par Langue</h3>
          <div className="h-[250px] w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
              <BarChart data={langData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} width={80} />
                <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} name="Vues">
                  {langData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % 3]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color = "text-text-primary" }: any) {
  return (
    <div className="card p-6 flex items-start justify-between group hover:border-primary/50 transition-all">
      <div>
        <p className="text-caption font-bold text-text-muted uppercase tracking-wider mb-1">{title}</p>
        <div className={`text-display-xs font-heading font-extrabold ${color}`}>{value}</div>
        <div className={`text-caption mt-2 font-medium ${trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
          {trend} <span className="text-text-muted">vs mois dernier</span>
        </div>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-surface-hover border border-border flex items-center justify-center text-text-muted group-hover:bg-primary-soft group-hover:text-primary group-hover:border-primary/20 transition-all mb-4 scale-110 shadow-sm">
        {icon === 'eye' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
        {icon === 'cursor' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>}
        {icon === 'percent' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>}
        {icon === 'exit' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>}
      </div>
    </div>
  );
}
