export type TenderCategory =
  | 'CONSTRUCAO_CIVIL'
  | 'TECNOLOGIA'
  | 'LIMPEZA'
  | 'ALIMENTACAO'
  | 'TRANSPORTE'
  | 'SEGURANCA'
  | 'SAUDE'
  | 'EDUCACAO'
  | 'MANUTENCAO'
  | 'SERVICOS_GERAIS';

export type TenderModality =
  | 'PREGAO_ELETRONICO'
  | 'CONCORRENCIA'
  | 'TOMADA_DE_PRECOS'
  | 'CONVITE'
  | 'DISPENSA'
  | 'INEXIGIBILIDADE'
  | 'RDC'
  | 'CONCURSO';

export type TenderStatus = 'OPEN' | 'CLOSED' | 'IN_REVIEW';
export type AlertStatus = 'NEW' | 'READ' | 'ARCHIVED';
export type ScraperLogStatus = 'SUCCESS' | 'FAILED' | 'RUNNING';

export interface Plan {
  id: string;
  name: string;
  slug: 'free' | 'premium';
  maxFilters: number | null;
  maxFavorites: number | null;
  maxTenderResults?: number | null;
  emailAlertsEnabled: boolean;
  priceCents?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  city: string;
  state: string;
  companyType: string;
  createdAt: string;
  plan: Plan;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  publicOrg: string;
  city: string;
  state: string;
  category: TenderCategory;
  modality: TenderModality;
  estimatedValue: string;
  publicationDate: string;
  deadlineDate: string;
  originalLink: string | null;
  source: string;
  status: TenderStatus;
  createdAt: string;
}

export interface PaginatedTenders {
  items: Tender[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  limitedByPlan: boolean;
}

export interface InterestFilter {
  id: string;
  city: string | null;
  state: string | null;
  keyword: string | null;
  category: TenderCategory | null;
  minValue: string | null;
  maxValue: string | null;
  publicOrg: string | null;
  modality: TenderModality | null;
  createdAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  tenderId: string;
  status: AlertStatus;
  createdAt: string;
  tender: Tender;
}

export interface Favorite {
  id: string;
  userId: string;
  tenderId: string;
  createdAt: string;
  tender: Tender;
}

export interface ScraperLog {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  status: ScraperLogStatus;
  tendersFound: number;
  tendersCreated: number;
  errorMessage: string | null;
  source: string;
}

export interface DashboardSummary {
  totalTenders: number;
  newAlertsCount: number;
  favoritesCount: number;
  filtersCount: number;
  tendersNearDeadline: Tender[];
  recentTenders: Tender[];
  recentScraperLogs: ScraperLog[];
}

export const CATEGORY_LABELS: Record<TenderCategory, string> = {
  CONSTRUCAO_CIVIL: 'Construção Civil',
  TECNOLOGIA: 'Tecnologia',
  LIMPEZA: 'Limpeza',
  ALIMENTACAO: 'Alimentação',
  TRANSPORTE: 'Transporte',
  SEGURANCA: 'Segurança',
  SAUDE: 'Saúde',
  EDUCACAO: 'Educação',
  MANUTENCAO: 'Manutenção',
  SERVICOS_GERAIS: 'Serviços Gerais',
};

export const MODALITY_LABELS: Record<TenderModality, string> = {
  PREGAO_ELETRONICO: 'Pregão Eletrônico',
  CONCORRENCIA: 'Concorrência',
  TOMADA_DE_PRECOS: 'Tomada de Preços',
  CONVITE: 'Convite',
  DISPENSA: 'Dispensa',
  INEXIGIBILIDADE: 'Inexigibilidade',
  RDC: 'RDC',
  CONCURSO: 'Concurso',
};

export const STATUS_LABELS: Record<TenderStatus, string> = {
  OPEN: 'Aberto',
  CLOSED: 'Encerrado',
  IN_REVIEW: 'Em análise',
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  NEW: 'Novo',
  READ: 'Lido',
  ARCHIVED: 'Arquivado',
};
