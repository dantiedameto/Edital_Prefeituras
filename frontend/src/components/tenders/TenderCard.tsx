import Link from 'next/link';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StatusBadge } from './StatusBadge';
import { FavoriteButton } from './FavoriteButton';
import { CATEGORY_LABELS, Tender } from '../../types';
import { formatCurrency, formatDate, daysUntil } from '../../lib/format';

export function TenderCard({ tender, isFavorited }: { tender: Tender; isFavorited: boolean }) {
  const daysLeft = daysUntil(tender.deadlineDate);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/editais/${tender.id}`} className="font-semibold text-ink-primary hover:text-primary-600">
            {tender.title}
          </Link>
          <p className="mt-1 truncate text-sm text-ink-secondary">{tender.publicOrg}</p>
        </div>
        <FavoriteButton tenderId={tender.id} initialFavorited={isFavorited} />
      </div>

      <div className="flex flex-wrap gap-2">
        <StatusBadge status={tender.status} />
        <Badge tone="info">{CATEGORY_LABELS[tender.category]}</Badge>
        <Badge tone="neutral">
          {tender.city}/{tender.state}
        </Badge>
        {tender.status === 'OPEN' && daysLeft >= 0 && daysLeft <= 7 && (
          <Badge tone="warning">Prazo em {daysLeft} dia{daysLeft === 1 ? '' : 's'}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line-hairline pt-3 text-sm">
        <span className="font-medium text-ink-primary">{formatCurrency(tender.estimatedValue)}</span>
        <span className="text-ink-muted">Prazo: {formatDate(tender.deadlineDate)}</span>
      </div>
    </Card>
  );
}
