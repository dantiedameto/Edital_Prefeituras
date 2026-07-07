'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setFormError(data.message ?? 'Não foi possível entrar. Verifique seus dados.');
      return;
    }

    router.push(searchParams.get('redirect') ?? '/dashboard');
    router.refresh();
  };

  return (
    <Card className="w-full max-w-md">
      <h1 className="text-xl font-semibold text-ink-primary">Entrar na sua conta</h1>
      <p className="mt-1 text-sm text-ink-secondary">Acesse o painel de editais e alertas.</p>

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="E-mail" type="email" placeholder="voce@empresa.com" {...register('email')} error={errors.email?.message} />
        <Input label="Senha" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

        {formError && <p className="text-sm text-status-critical">{formError}</p>}

        <Button type="submit" isLoading={isSubmitting} className="mt-2">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-sm text-ink-secondary">
        Ainda não tem conta?{' '}
        <Link href="/cadastro" className="font-medium text-primary-600 hover:underline">
          Criar conta grátis
        </Link>
      </p>

      <p className="mt-3 rounded-lg bg-surface-plane p-3 text-xs text-ink-muted">
        Conta de demonstração: <strong>demo@centraldeeditais.com.br</strong> / senha <strong>senha123</strong>
      </p>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-plane px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
