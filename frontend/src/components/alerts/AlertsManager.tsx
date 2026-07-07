'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { CheckIcon, ArchiveIcon, BellIcon } from '../ui/icons';
import { ALERT_STATUS_LABELS, Alert, AlertStatus } from '../../types';
import { formatDate } from '../../lib/format';
import { clientFetch, ApiClientError } from '../../lib/api-client';

const TONE_BY_STATUS: Record<AlertStatus, 'info' | 'neutral' | 'good'> = {
  NEW: 'info',
  READ: 'neutral',
  ARCHIVED: 'neutral',
};

export function AlertsManager({ initialAlerts }: { initialAlerts: Alert[] }) {
  const router = useRouter();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (id: string, status: AlertStatus) => {
    setError(null);
    try {
      await clientFetch(`/alerts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, status } : alert)));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Não foi possível atualizar o alerta.');
    }
  };

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={<BellIcon className="h-8 w-8" />}
        title="Nenhum alerta por aqui ainda"
        description="Assim que um edital combinar com um dos seus filtros de interesse, ele aparece aqui automaticamente."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="text-sm text-status-critical">{error}</p>}
      {alerts.map((alert) => (
        <Card key={alert.id} className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2">
              <Badge tone={TONE_BY_STATUS[alert.status]}>{ALERT_STATUS_LABELS[alert.status]}</Badge>
              <span className="text-xs text-ink-muted">{formatDate(alert.createdAt)}</span>
            </div>
            <Link href={`/editais/${alert.tenderId}`} className="font-medium text-ink-primary hover:text-primary-600">
              {alert.tender.title}
            </Link>
            <p className="text-sm text-ink-secondary">{alert.tender.publicOrg}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            {alert.status !== 'READ' && (
              <Button size="sm" variant="secondary" onClick={() => updateStatus(alert.id, 'READ')}>
                <CheckIcon className="h-4 w-4" />
                Marcar como lido
              </Button>
            )}
            {alert.status !== 'ARCHIVED' && (
              <Button size="sm" variant="ghost" onClick={() => updateStatus(alert.id, 'ARCHIVED')}>
                <ArchiveIcon className="h-4 w-4" />
                Arquivar
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
