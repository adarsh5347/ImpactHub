import { Badge } from './ui/badge';

interface StatusBadgeProps {
  status: string;
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
    verified: {
      label: 'Verified',
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    pending: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    approved: {
      label: 'Approved',
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-700 border-red-200',
    },
    suspended: {
      label: 'Suspended',
      className: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    active: {
      label: 'Active',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-700 border-red-200',
    },
  };

  const normalizedStatus = status.toLowerCase();
  const config = configs[normalizedStatus as keyof typeof configs] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${variant === 'small' ? 'text-xs' : ''}`}
    >
      {config.label}
    </Badge>
  );
}
