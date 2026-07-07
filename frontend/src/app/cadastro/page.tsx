'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const schema = z.object({
  name: z.string().min(2, 'Informe seu nome.'),
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
  city: z.string().min(2, 'Informe a cidade.'),
  state: z.string().min(2, 'Informe o estado.'),
  companyType: z.string().min(2, 'Informe o tipo de empresa.'),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFormError(data.message ?? 'Não foi possível criar a conta.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-plane px-4 py-10">
      <Card className="w-full max-w-lg">
        <h1 className="text-xl font-semibold text-ink-primary">Criar conta grátis</h1>
        <p className="mt-1 text-sm text-ink-secondary">Comece a acompanhar editais em poucos minutos.</p>

        <form className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="sm:col-span-2">
            <Input label="Nome" placeholder="Seu nome ou da empresa" {...register('name')} error={errors.name?.message} />
          </div>
          <div className="sm:col-span-2">
            <Input label="E-mail" type="email" placeholder="voce@empresa.com" {...register('email')} error={errors.email?.message} />
          </div>
          <div className="sm:col-span-2">
            <Input label="Senha" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
          </div>
          <Input label="Cidade" placeholder="São Paulo" {...register('city')} error={errors.city?.message} />
          <Input label="Estado" placeholder="SP" {...register('state')} error={errors.state?.message} />
          <div className="sm:col-span-2">
            <Input
              label="Tipo de empresa"
              placeholder="Ex: Prestador de serviços, Construtora, MEI..."
              {...register('companyType')}
              error={errors.companyType?.message}
            />
          </div>

          {formError && (
            <p className="sm:col-span-2 text-sm text-status-critical">{formError}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="sm:col-span-2 mt-2">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-sm text-ink-secondary">
          Já tem conta?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
