import Link from 'next/link';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckIcon } from '../../components/ui/icons';
import { serverFetch, isAuthenticated } from '../../lib/api-server';
import { Plan } from '../../types';

function planFeatures(plan: Plan): string[] {
  if (plan.slug === 'premium') {
    return ['Filtros de interesse ilimitados', 'Alertas por e-mail e no painel', 'Favoritos ilimitados', 'Acesso completo à lista de editais'];
  }
  return [
    `Até ${plan.maxFilters} filtros de interesse`,
    'Alertas apenas no painel',
    `Até ${plan.maxFavorites} favoritos`,
    'Visualização limitada da lista de editais',
  ];
}

export default async function PlanosPage() {
  const plans = await serverFetch<Plan[]>('/plans');
  const alreadyLoggedIn = isAuthenticated();

  return (
    <div>
      <PublicNavbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-ink-primary">Planos simples, sem surpresas</h1>
          <p className="mt-3 text-ink-secondary">Comece grátis e faça upgrade quando precisar de mais alcance.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink-primary">{plan.name}</h2>
                {plan.slug === 'premium' && <Badge tone="good">Recomendado</Badge>}
              </div>
              <p className="text-3xl font-semibold text-ink-primary">
                {plan.priceCents ? `R$ ${(plan.priceCents / 100).toFixed(2).replace('.', ',')}` : 'Grátis'}
                {plan.priceCents ? <span className="text-sm font-normal text-ink-muted">/mês</span> : null}
              </p>
              <ul className="flex flex-col gap-2 text-sm text-ink-secondary">
                {planFeatures(plan).map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-status-good" />
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.slug === 'free' ? (
                <Link href={alreadyLoggedIn ? '/dashboard' : '/cadastro'}>
                  <Button variant="secondary" className="w-full">
                    {alreadyLoggedIn ? 'Ir para o dashboard' : 'Criar conta grátis'}
                  </Button>
                </Link>
              ) : (
                <Button className="w-full" disabled title="Pagamento será integrado em uma versão futura">
                  Fazer upgrade (em breve)
                </Button>
              )}
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink-muted">
          A cobrança do plano Premium ainda não está integrada nesta versão de demonstração (MVP).
        </p>
      </main>
      <PublicFooter />
    </div>
  );
}
