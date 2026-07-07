import { HTMLAttributes } from 'react';
import clsx from 'clsx';

type Tone = 'good' | 'warning' | 'serious' | 'critical' | 'neutral' | 'info';

const toneClasses: Record<Tone, string> = {
  good: 'bg-status-good/10 text-status-good',
  warning: 'bg-status-warning/15 text-[#8a5a00]',
  serious: 'bg-status-serious/15 text-[#9a3f1f]',
  critical: 'bg-status-critical/10 text-status-critical',
  neutral: 'bg-ink-muted/10 text-ink-secondary',
  info: 'bg-primary-100 text-primary-700',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
