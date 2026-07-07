import { serverFetch } from '../../../lib/api-server';
import { TenderFiltersBar } from '../../../components/tenders/TenderFiltersBar';
import { TenderCard } from '../../../components/tenders/TenderCard';
import { Pagination } from '../../../components/ui/Pagination';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { PaginatedTenders, Favorite } from '../../../types';

interface EditaisPageProps {
  searchParams: Record<string, string | undefined>;
}

export default async function EditaisPage({ searchParams }: EditaisPageProps) {
  const params = new URLSearchParams();
  ['keyword', 'city', 'state', 'category', 'status'].forEach((key) => {
    if (searchParams[key]) params.set(key, searchParams[key]!);
  });
  params.set('page', searchParams.page ?? '1');
  params.set('pageSize', '12');

  const [tendersResult, favorites] = await Promise.all([
    serverFetch<PaginatedTenders>(`/tenders?${params.toString()}`),
    serverFetch<Favorite[]>('/favorites'),
  ]);

  const favoritedIds = new Set(favorites.map((favorite) => favorite.tenderId));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-ink-primary">Lista de editais</h1>
        <p className="text-sm text-ink-secondary">Busque e filtre licitações por cidade, estado, categoria e status.</p>
      </div>

      <TenderFiltersBar defaultValues={searchParams} />

      {tendersResult.limitedByPlan && (
        <Badge tone="warning" className="w-fit">
          Seu plano gratuito mostra um número limitado de resultados. Faça upgrade para ver todos os editais.
        </Badge>
      )}

      {tendersResult.items.length === 0 ? (
        <EmptyState title="Nenhum edital encontrado" description="Tente ajustar os filtros de busca ou rode o robô no dashboard." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tendersResult.items.map((tender) => (
            <TenderCard key={tender.id} tender={tender} isFavorited={favoritedIds.has(tender.id)} />
          ))}
        </div>
      )}

      <Pagination
        page={tendersResult.page}
        totalPages={tendersResult.totalPages}
        basePath="/editais"
        searchParams={searchParams}
      />
    </div>
  );
}
