import Link from 'next/link';
import { serverFetch } from '../../../../lib/api-server';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';
import { StatusBadge } from '../../../../components/tenders/StatusBadge';
import { FavoriteButton } from '../../../../components/tenders/FavoriteButton';
import { CATEGORY_LABELS, MODALITY_LABELS, Favorite, Tender } from '../../../../types';
import { formatCurrency, formatDate } from '../../../../lib/format';

export default async function TenderDetailPage({ params }: { params: { id: string } }) {
  const [tender, favorites] = await Promise.all([
    serverFetch<Tender>(`/tenders/${params.id}`),
    serverFetch<Favorite[]>('/favorites'),
  ]);
  const isFavorited = favorites.some((favorite) => favorite.tenderId === tender.id);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link href="/editais" className="text-sm font-medium text-primary-600 hover:underline">
        ← Voltar para a lista de editais
      </Link>

      <Card className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-ink-primary">{tender.title}</h1>
            <p className="mt-1 text-sm text-ink-secondary">{tender.publicOrg}</p>
          </div>
          <FavoriteButton tenderId={tender.id} initialFavorited={isFavorited} />
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={tender.status} />
          <Badge tone="info">{CATEGORY_LABELS[tender.category]}</Badge>
          <Badge tone="neutral">{MODALITY_LABELS[tender.modality]}</Badge>
          <Badge tone="neutral">
            {tender.city}/{tender.state}
          </Badge>
        </div>

        <p className="whitespace-pre-line text-sm leading-relaxed text-ink-secondary">{tender.description}</p>

        <div className="grid grid-cols-2 gap-4 rounded-xl2 bg-surface-plane p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-xs text-ink-muted">Valor estimado</p>
            <p className="font-semibold text-ink-primary">{formatCurrency(tender.estimatedValue)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Publicação</p>
            <p className="font-semibold text-ink-primary">{formatDate(tender.publicationDate)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Prazo final</p>
            <p className="font-semibold text-ink-primary">{formatDate(tender.deadlineDate)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Fonte</p>
            <p className="font-semibold text-ink-primary">{tender.source}</p>
          </div>
        </div>

        {tender.originalLink && (
          <p className="text-xs text-ink-muted">
            Link original (dado fictício de demonstração):{' '}
            <span className="break-all text-primary-600">{tender.originalLink}</span>
          </p>
        )}
      </Card>
    </div>
  );
}
