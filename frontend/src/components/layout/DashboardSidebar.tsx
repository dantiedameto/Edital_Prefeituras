'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { NAV_ITEMS } from './nav-items';
import { DocumentIcon } from '../ui/icons';

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-line-hairline bg-surface md:flex md:flex-col">
      <div className="flex items-center gap-2 px-5 py-5 font-semibold text-ink-primary">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white">
          <DocumentIcon className="h-4 w-4" />
        </span>
        <span className="text-sm leading-tight">Central de Editais</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-primary-50 text-primary-700' : 'text-ink-secondary hover:bg-surface-plane',
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 text-xs text-ink-muted">
        <Link href="/planos" className="hover:text-ink-secondary">
          Ver planos e upgrade →
        </Link>
      </div>
    </aside>
  );
}
