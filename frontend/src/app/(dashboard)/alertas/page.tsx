import { serverFetch } from '../../../lib/api-server';
import { AlertsManager } from '../../../components/alerts/AlertsManager';
import { Alert } from '../../../types';

export default async function AlertasPage() {
  const alerts = await serverFetch<Alert[]>('/alerts');

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink-primary">Meus alertas</h1>
        <p className="text-sm text-ink-secondary">Editais que combinaram com os seus filtros de interesse.</p>
      </div>
      <AlertsManager initialAlerts={alerts} />
    </div>
  );
}
