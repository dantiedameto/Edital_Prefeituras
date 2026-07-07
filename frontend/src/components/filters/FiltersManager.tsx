'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { FilterForm } from './FilterForm';
import { PlusIcon, TrashIcon, FilterIcon } from '../ui/icons';
import { CATEGORY_LABELS, InterestFilter, MODALITY_LABELS, Plan } from '../../types';
import { clientFetch, ApiClientError } from '../../lib/api-client';

function describeFilter(filter: InterestFilter): string[] {
  const parts: string[] = [];
  if (filter.city) parts.push(`Cidade: ${filter.city}`);
  if (filter.state) parts.push(`Estado: ${filter.state}`);
  if (filter.category) parts.push(CATEGORY_LABELS[filter.category]);
  if (filter.modality) parts.push(MODALITY_LABELS[filter.modality]);
  if (filter.keyword) parts.push(`"${filter.keyword}"`);
  if (filter.publicOrg) parts.push(`Órgão: ${filter.publicOrg}`);
  if (filter.minValue) parts.push(`Min: R$ ${Number(filter.minValue).toLocaleString('pt-BR')}`);
  if (filter.maxValue) parts.push(`Max: R$ ${Number(filter.maxValue).toLocaleString('pt-BR')}`);
  return parts.length > 0 ? parts : ['Sem critérios específicos (todos os editais)'];
}

export function FiltersManager({ initialFilters, plan }: { initialFilters: InterestFilter[]; plan: Plan }) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const limitReached = plan.maxFilters !== null && filters.length >= plan.maxFilters;

  const refresh = async () => {
    const updated = await clientFetch<InterestFilter[]>('/interest-filters');
    setFilters(updated);
    setIsCreating(false);
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await clientFetch(`/interest-filters/${id}`, { method: 'DELETE' });
      setFilters((prev) => prev.filter((filter) => filter.id !== id));
      router.refresh();
    } catch (err) {
      setDeleteError(err instanceof ApiClientError ? err.message : 'Não foi possível excluir o filtro.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink-primary">Meus filtros de interesse</h1>
          <p className="text-sm text-ink-secondary">
            {filters.length}
            {plan.maxFilters !== null ? ` de ${plan.maxFilters}` : ''} filtros cadastrados
            {plan.maxFilters === null && ' · plano com filtros ilimitados'}
          </p>
        </div>
        {!isCreating && (
          <Button size="sm" onClick={() => setIsCreating(true)} disabled={limitReached}>
            <PlusIcon className="h-4 w-4" />
            Novo filtro
          </Button>
        )}
      </div>

      {limitReached && (
        <Badge tone="warning" className="w-fit">
          Você atingiu o limite de filtros do plano {plan.name}. Faça upgrade para cadastrar filtros ilimitados.
        </Badge>
      )}

      {isCreating && (
        <Card>
          <h2 className="mb-4 font-semibold text-ink-primary">Novo filtro</h2>
          <FilterForm onSaved={refresh} onCancel={() => setIsCreating(false)} />
        </Card>
      )}

      {deleteError && <p className="text-sm text-status-critical">{deleteError}</p>}

      {filters.length === 0 && !isCreating ? (
        <EmptyState
          icon={<FilterIcon className="h-8 w-8" />}
          title="Nenhum filtro cadastrado"
          description="Cadastre filtros de cidade, categoria ou palavra-chave para receber alertas automáticos."
          action={
            <Button size="sm" onClick={() => setIsCreating(true)}>
              Criar meu primeiro filtro
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filters.map((filter) =>
            editingId === filter.id ? (
              <Card key={filter.id}>
                <h2 className="mb-4 font-semibold text-ink-primary">Editar filtro</h2>
                <FilterForm filter={filter} onSaved={refresh} onCancel={() => setEditingId(null)} />
              </Card>
            ) : (
              <Card key={filter.id} className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {describeFilter(filter).map((part) => (
                    <Badge key={part} tone="neutral">
                      {part}
                    </Badge>
                  ))}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setEditingId(filter.id)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(filter.id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ),
          )}
        </div>
      )}
    </div>
  );
}
