'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CATEGORY_LABELS, InterestFilter, MODALITY_LABELS } from '../../types';
import { clientFetch, ApiClientError } from '../../lib/api-client';

interface FormValues {
  city: string;
  state: string;
  keyword: string;
  category: string;
  modality: string;
  publicOrg: string;
  minValue: string;
  maxValue: string;
}

function toDefaultValues(filter?: InterestFilter): FormValues {
  return {
    city: filter?.city ?? '',
    state: filter?.state ?? '',
    keyword: filter?.keyword ?? '',
    category: filter?.category ?? '',
    modality: filter?.modality ?? '',
    publicOrg: filter?.publicOrg ?? '',
    minValue: filter?.minValue ?? '',
    maxValue: filter?.maxValue ?? '',
  };
}

interface FilterFormProps {
  filter?: InterestFilter;
  onSaved: () => void;
  onCancel: () => void;
}

export function FilterForm({ filter, onSaved, onCancel }: FilterFormProps) {
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>({ defaultValues: toDefaultValues(filter) });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const payload = {
      city: values.city || undefined,
      state: values.state || undefined,
      keyword: values.keyword || undefined,
      category: values.category || undefined,
      modality: values.modality || undefined,
      publicOrg: values.publicOrg || undefined,
      minValue: values.minValue ? Number(values.minValue) : undefined,
      maxValue: values.maxValue ? Number(values.maxValue) : undefined,
    };

    try {
      if (filter) {
        await clientFetch(`/interest-filters/${filter.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await clientFetch('/interest-filters', { method: 'POST', body: JSON.stringify(payload) });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Não foi possível salvar o filtro.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Input label="Cidade" placeholder="Ex: São Paulo" {...register('city')} />
      <Input label="Estado (UF)" placeholder="Ex: SP" maxLength={2} {...register('state')} />
      <div className="sm:col-span-2">
        <Input label="Palavra-chave" placeholder="Ex: manutenção predial" {...register('keyword')} />
      </div>
      <Select label="Categoria" {...register('category')}>
        <option value="">Qualquer categoria</option>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Select label="Modalidade" {...register('modality')}>
        <option value="">Qualquer modalidade</option>
        {Object.entries(MODALITY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      <Input label="Órgão público" placeholder="Ex: Secretaria de Saúde" {...register('publicOrg')} />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Valor mínimo (R$)" type="number" step="0.01" {...register('minValue')} />
        <Input label="Valor máximo (R$)" type="number" step="0.01" {...register('maxValue')} />
      </div>

      {error && <p className="sm:col-span-2 text-sm text-status-critical">{error}</p>}

      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" isLoading={formState.isSubmitting}>
          {filter ? 'Salvar alterações' : 'Criar filtro'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
