import Link from 'next/link';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { BellIcon, BuildingIcon, ClockIcon, FilterIcon } from '../components/ui/icons';

const BENEFITS = [
  {
    icon: BellIcon,
    title: 'Receba alertas automáticos',
    description: 'Assim que um edital compatível com seus filtros é encontrado, você é avisado no painel — e por e-mail no plano Premium.',
  },
  {
    icon: FilterIcon,
    title: 'Filtre por cidade e categoria',
    description: 'Cadastre filtros por cidade, estado, categoria, palavra-chave, órgão, modalidade e faixa de valor.',
  },
  {
    icon: ClockIcon,
    title: 'Economize tempo procurando',
    description: 'Um robô de busca roda diariamente para você, então sua equipe não precisa vasculhar portais manualmente.',
  },
  {
    icon: BuildingIcon,
    title: 'Nunca perca um prazo',
    description: 'Acompanhe no dashboard os editais que estão perto do prazo final antes que seja tarde demais.',
  },
];

export default function LandingPage() {
  return (
    <div>
      <PublicNavbar />

      <main>
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <span className="inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
            Monitoramento de licitações públicas
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight text-ink-primary md:text-5xl">
            Muitas empresas perdem oportunidades em licitações porque não acompanham editais diariamente.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-secondary">
            A Central de Editais Públicos monitora licitações por cidade, categoria e palavra-chave, e avisa você
            assim que surgir uma oportunidade compatível com o seu negócio.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/cadastro">
              <Button size="lg">Criar conta grátis</Button>
            </Link>
            <Link href="/planos">
              <Button size="lg" variant="secondary">
                Ver planos
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Ideal para pequenas empresas e prestadores de serviço que vendem para o setor público.
          </p>
        </section>

        <section id="beneficios" className="bg-surface py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-2xl font-semibold text-ink-primary">
              Tudo que você precisa para não perder oportunidades
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {BENEFITS.map((benefit) => (
                <Card key={benefit.title} className="flex flex-col gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl2 bg-primary-100 text-primary-600">
                    <benefit.icon className="h-5 w-5" />
                  </span>
                  <p className="font-semibold text-ink-primary">{benefit.title}</p>
                  <p className="text-sm text-ink-secondary">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold text-ink-primary">Pronto para parar de perder editais?</h2>
          <p className="mt-3 text-ink-secondary">
            Crie sua conta gratuita em menos de um minuto e cadastre seu primeiro filtro de interesse.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/cadastro">
              <Button size="lg">Criar conta grátis</Button>
            </Link>
            <Link href="/planos">
              <Button size="lg" variant="secondary">
                Comparar planos
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
