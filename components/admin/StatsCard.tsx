interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  accent?: 'primary' | 'success' | 'warning' | 'danger';
}

const accentMap = {
  primary: 'text-primary bg-primary-soft',
  success: 'text-success bg-success-soft',
  warning: 'text-warning bg-warning-soft',
  danger: 'text-danger bg-danger-soft',
};

export default function StatsCard({ label, value, icon, trend, accent = 'primary' }: StatsCardProps) {
  return (
    <div className="card p-6 hover:shadow-card-hover transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentMap[accent]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-caption font-medium ${trend.value >= 0 ? 'text-success' : 'text-danger'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="font-heading font-bold text-display-sm text-text-primary leading-none mb-1">
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
      </p>
      <p className="text-body-sm text-text-muted">{label}</p>
    </div>
  );
}
