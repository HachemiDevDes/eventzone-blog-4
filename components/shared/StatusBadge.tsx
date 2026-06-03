interface StatusBadgeProps {
  status: 'draft' | 'published' | 'scheduled';
}

const statusConfig = {
  draft: {
    label: 'Brouillon',
    className: 'badge-muted',
  },
  published: {
    label: 'Publié',
    className: 'badge-success',
  },
  scheduled: {
    label: 'Planifié',
    className: 'badge-warning',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={config.className}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === 'draft' ? 'bg-text-muted' :
        status === 'published' ? 'bg-success' :
        'bg-warning'
      }`} />
      {config.label}
    </span>
  );
}
