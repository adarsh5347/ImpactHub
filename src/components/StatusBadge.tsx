import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: 'ongoing' | 'completed' | 'funded' | 'verified' | 'pending';
  variant?: 'default' | 'small';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const configs = {
    ongoing: {
      label: 'Ongoing',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    funded: {
      label: 'Fully Funded',
      className: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    verified: {
      label: 'Verified',
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
  };

  const config = configs[status];

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${variant === 'small' ? 'text-xs' : ''}`}
    >
      {config.label}
    </Badge>
  );
}
