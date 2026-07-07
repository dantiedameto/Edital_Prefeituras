import { TenderCategory, TenderModality, TenderStatus } from '@prisma/client';

export interface RawTenderData {
  title: string;
  description: string;
  publicOrg: string;
  city: string;
  state: string;
  category: TenderCategory;
  modality: TenderModality;
  estimatedValue: number;
  publicationDate: Date;
  deadlineDate: Date;
  originalLink: string;
  status: TenderStatus;
  source: string;
}

/**
 * Contrato para uma fonte de editais. A versão atual usa apenas o
 * MockScraperSourceProvider; no futuro, cada fonte real (PNCP, portais de
 * prefeitura, diários oficiais) implementa esta mesma interface e é
 * registrada no ScraperModule sem alterar o restante do pipeline.
 */
export interface ScraperSourceProvider {
  readonly sourceName: string;
  fetchTenders(): Promise<RawTenderData[]>;
}

export const SCRAPER_SOURCE_PROVIDERS = 'SCRAPER_SOURCE_PROVIDERS';
