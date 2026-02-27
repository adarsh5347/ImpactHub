import { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import { cn } from './ui/utils';

interface NgoLogoProps {
  logoUrl?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeStyles: Record<NonNullable<NgoLogoProps['size']>, string> = {
  sm: 'w-10 h-10 text-xs',
  md: 'w-16 h-16 text-sm',
  lg: 'w-32 h-32 text-2xl',
};

function initialsFromName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return 'NG';
  const parts = trimmed.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'NG';
}

export function NgoLogo({ logoUrl, name, size = 'md', className }: NgoLogoProps) {
  const [hasLoadError, setHasLoadError] = useState(false);

  const initials = useMemo(() => initialsFromName(name), [name]);
  const showImage = Boolean(logoUrl) && !hasLoadError;

  if (showImage) {
    return (
      <img
        src={logoUrl ?? undefined}
        alt={`${name} logo`}
        className={cn('rounded-lg object-cover border border-gray-200 bg-white', sizeStyles[size], className)}
        onError={() => setHasLoadError(true)}
      />
    );
  }

  return (
    <div
      aria-label={`${name} logo placeholder`}
      className={cn(
        'rounded-lg border border-gray-200 bg-gray-100 text-gray-700 flex items-center justify-center font-semibold',
        sizeStyles[size],
        className
      )}
    >
      {initials ? initials : <Building2 className="w-5 h-5" />}
    </div>
  );
}
