'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';
import { RobotIcon } from '../ui/icons';
import { clientFetch, ApiClientError } from '../../lib/api-client';

interface ScrapeResult {
  tendersFound: number;
  tendersCreated: number;
  alertsCreated: number;
}

export function RunScraperButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await clientFetch<ScrapeResult>('/scraper/run', { method: 'POST' });
      setResult(data);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Não foi possível rodar a busca agora.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <Button variant="secondary" size="sm" onClick={handleRun} isLoading={isLoading}>
        <RobotIcon className="h-4 w-4" />
        Simular busca diária agora
      </Button>
      {result && (
        <p className="text-xs text-status-good">
          {result.tendersFound} encontrados · {result.tendersCreated} novos · {result.alertsCreated} alertas criados
        </p>
      )}
      {error && <p className="text-xs text-status-critical">{error}</p>}
    </div>
  );
}
