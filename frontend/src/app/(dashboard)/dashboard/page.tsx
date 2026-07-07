import Link from 'next/link';
import { serverFetch } from '../../../lib/api-server';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { EmptyState } from '../../../components/ui/EmptyState';
import { StatTile } from '../../../components/dashboard/StatTile';
import { RunScraperButton } from '../../../components/dashboard/RunScraperButton';
import { DocumentIcon, BellIcon, ClockIcon, StarIcon, FilterIcon, RobotIcon } from '../../../components/ui/icons';
import { CATEGORY_LABELS, DashboardSummary } from '../../../types';
import { formatCurrency, formatDate } from '../../../lib/format';

const SCRAPER_STATUS_TONE = { SUCCESS: 'good', FAILED: 'critical', RUNNING: 'warning' } as const;

export default async function DashboardPage() {
  const summary = await serverFetch<DashboardSummary>('/dashboard/summary');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink-primary">Dashboard</h1>
          <p className="text-sm text-ink-secondary">Visão geral dos editais e alertas monitorados para você.</p>
        </div>
        <RunScraperButton />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatTile label="Total de editais" value={summary.totalTenders} icon={<DocumentIcon className="h-5 w-5" />} accent="blue" />
        <StatTile label="Alertas novos" value={summary.newAlertsCount} icon={<BellIcon className="h-5 w-5" />} accent="aqua" />
        <StatTile label="Perto do prazo" value={summary.tendersNearDeadline.length} icon={<ClockIcon className="h-5 w-5" />} accent="warning" />
        <StatTile label="Favoritos" value={summary.favoritesCount} icon={<StarIcon className="h-5 w-5" />} accent="violet" />
        <StatTile label="Filtros cadastrados" value={summary.filtersCount} icon={<FilterIcon className="h-5 w-5" />} accent="red" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-primary">Editais próximos do prazo final</h2>
            <Link href="/editais" className="text-xs font-medium text-primary-600 hover:underline">
              Ver todos
            </Link>
          </div>
          {summary.tendersNearDeadline.length === 0 ? (
            <p className="text-sm text-ink-muted">Nenhum edital com prazo nos próximos 7 dias.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line-hairline">
              {summary.tendersNearDeadline.map((tender) => (
                <li key={tender.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <Link href={`/editais/${tender.id}`} className="min-w-0 truncate font-medium text-ink-primary hover:text-primary-600">
                    {tender.title}
                  </Link>
                  <Badge tone="warning">{formatDate(tender.deadlineDate)}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-ink-primary">Últimos editais encontrados</h2>
            <Link href="/editais" className="text-xs font-medium text-primary-600 hover:underline">
              Ver todos
            </Link>
          </div>
          {summary.recentTenders.length === 0 ? (
            <EmptyState title="Nenhum edital ainda" description="Rode a busca do robô para simular a chegada de novos editais." />
          ) : (
            <ul className="flex flex-col divide-y divide-line-hairline">
              {summary.recentTenders.map((tender) => (
                <li key={tender.id} className="flex flex-col gap-1 py-3 text-sm">
                  <Link href={`/editais/${tender.id}`} className="font-medium text-ink-primary hover:text-primary-600">
                    {tender.title}
                  </Link>
                  <span className="text-xs text-ink-muted">
                    {CATEGORY_LABELS[tender.category]} · {tender.city}/{tender.state} · {formatCurrency(tender.estimatedValue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <RobotIcon className="h-5 w-5 text-ink-secondary" />
          <h2 className="font-semibold text-ink-primary">Últimas execuções do robô de busca</h2>
        </div>
        {summary.recentScraperLogs.length === 0 ? (
          <p className="text-sm text-ink-muted">Nenhuma execução registrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-ink-muted">
                  <th className="pb-2 font-medium">Início</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Encontrados</th>
                  <th className="pb-2 font-medium">Novos</th>
                  <th className="pb-2 font-medium">Fonte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-hairline">
                {summary.recentScraperLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 text-ink-primary">{formatDate(log.startedAt)}</td>
                    <td className="py-2">
                      <Badge tone={SCRAPER_STATUS_TONE[log.status]}>{log.status}</Badge>
                    </td>
                    <td className="py-2">{log.tendersFound}</td>
                    <td className="py-2">{log.tendersCreated}</td>
                    <td className="py-2 text-ink-muted">{log.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
