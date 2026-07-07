'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { StarIcon } from '../ui/icons';
import { clientFetch, ApiClientError } from '../../lib/api-client';

export function FavoriteButton({ tenderId, initialFavorited }: { tenderId: string; initialFavorited: boolean }) {
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isFavorited) {
        await clientFetch(`/favorites/${tenderId}`, { method: 'DELETE' });
        setIsFavorited(false);
      } else {
        await clientFetch(`/favorites/${tenderId}`, { method: 'POST' });
        setIsFavorited(true);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Não foi possível atualizar o favorito.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={isLoading}
        aria-pressed={isFavorited}
        aria-label={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        className={clsx(
          'flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-60',
          isFavorited
            ? 'border-status-warning/40 bg-status-warning/10 text-[#8a5a00]'
            : 'border-line-baseline text-ink-muted hover:text-[#8a5a00]',
        )}
      >
        <StarIcon className="h-5 w-5" filled={isFavorited} />
      </button>
      {error && <p className="max-w-[10rem] text-right text-xs text-status-critical">{error}</p>}
    </div>
  );
}
