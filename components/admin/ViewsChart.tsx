'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
// Keep as empty or comment out format/fr imports if unused. 

interface ViewsChartProps {
  data: { date: string; views: number }[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-xl px-4 py-3 shadow-card">
        <p className="text-caption text-text-muted mb-1">{label}</p>
        <p className="font-heading font-bold text-body text-primary">
          {payload[0].value.toLocaleString('fr-FR')} vues
        </p>
      </div>
    );
  }
  return null;
};

export default function ViewsChart({ data }: ViewsChartProps) {
  return (
    <div className="card p-6">
      <h3 className="font-heading font-bold text-heading-sm text-text-primary mb-6">
        Vues quotidiennes — 30 derniers jours
      </h3>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2B7FFF" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2B7FFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1a1d26" strokeDasharray="4 4" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1a1d26', strokeWidth: 1 }} />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#2B7FFF"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, fill: '#2B7FFF', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
