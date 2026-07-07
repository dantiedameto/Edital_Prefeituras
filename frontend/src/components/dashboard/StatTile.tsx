import { ReactNode } from 'react';
import clsx from 'clsx';
import { Card } from '../ui/Card';

type Accent = 'blue' | 'aqua' | 'warning' | 'violet' | 'red';

const accentClasses: Record<Accent, string> = {
  blue: 'bg-primary-100 text-primary-600',
  aqua: 'bg-aqua/10 text-aqua',
  warning: 'bg-status-warning/15 text-[#8a5a00]',
  violet: 'bg-violet/10 text-violet',
  red: 'bg-categred/10 text-categred',
};

interface StatTileProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: Accent;
}

export function StatTile({ label, value, icon, accent = 'blue' }: StatTileProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className={clsx('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl2', accentClasses[accent])}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-ink-secondary">{label}</p>
        <p className="text-2xl font-semibold text-ink-primary">{value}</p>
      </div>
    </Card>
  );
}
