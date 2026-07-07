import Link from 'next/link';
import { Badge } from '../ui/Badge';
import { LogoutButton } from './LogoutButton';
import { NAV_ITEMS } from './nav-items';
import type { UserProfile } from '../../types';

export function DashboardTopbar({ user }: { user: UserProfile }) {
  return (
    <header className="sticky top-0 z-10 border-b border-line-hairline bg-surface/90 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div>
          <p className="text-sm font-medium text-ink-primary">Olá, {user.name.split(' ')[0]}</p>
          <p className="text-xs text-ink-muted">
            {user.city}/{user.state}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={user.plan.slug === 'premium' ? 'good' : 'neutral'}>Plano {user.plan.name}</Badge>
          <LogoutButton />
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-2 md:hidden">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-ink-secondary hover:bg-surface-plane"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
