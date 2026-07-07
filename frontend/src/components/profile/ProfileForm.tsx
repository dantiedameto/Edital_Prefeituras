'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserProfile } from '../../types';
import { clientFetch, ApiClientError } from '../../lib/api-client';

interface FormValues {
  name: string;
  city: string;
  state: string;
  companyType: string;
}

export function ProfileForm({ user }: { user: UserProfile }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: { name: user.name, city: user.city, state: user.state, companyType: user.companyType },
  });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    setMessage(null);
    try {
      await clientFetch('/users/me', { method: 'PATCH', body: JSON.stringify(values) });
      setMessage('Perfil atualizado com sucesso.');
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Não foi possível atualizar o perfil.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Input label="Nome" {...register('name')} />
      </div>
      <Input label="Cidade" {...register('city')} />
      <Input label="Estado" maxLength={2} {...register('state')} />
      <div className="sm:col-span-2">
        <Input label="Tipo de empresa" {...register('companyType')} />
      </div>
      <div className="sm:col-span-2">
        <Input label="E-mail" value={user.email} disabled />
      </div>

      {message && <p className="sm:col-span-2 text-sm text-status-good">{message}</p>}
      {error && <p className="sm:col-span-2 text-sm text-status-critical">{error}</p>}

      <Button type="submit" isLoading={formState.isSubmitting} className="sm:col-span-2 w-fit">
        Salvar alterações
      </Button>
    </form>
  );
}
