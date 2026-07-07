import { serverFetch } from '../../../lib/api-server';
import { TenderCard } from '../../../components/tenders/TenderCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { StarIcon } from '../../../components/ui/icons';
import { Favorite } from '../../../types';

export default async function FavoritosPage() {
  const favorites = await serverFetch<Favorite[]>('/favorites');

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink-primary">Favoritos</h1>
        <p className="text-sm text-ink-secondary">Editais que você salvou para acompanhar de perto.</p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<StarIcon className="h-8 w-8" />}
          title="Nenhum favorito ainda"
          description="Clique na estrela de um edital na lista para salvá-lo aqui."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((favorite) => (
            <TenderCard key={favorite.id} tender={favorite.tender} isFavorited />
          ))}
        </div>
      )}
    </div>
  );
}
