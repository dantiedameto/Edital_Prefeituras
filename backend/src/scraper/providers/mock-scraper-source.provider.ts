import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { TenderCategory, TenderModality, TenderStatus } from '@prisma/client';
import { RawTenderData, ScraperSourceProvider } from './scraper-source.interface';

const CATEGORIES = Object.values(TenderCategory);
const MODALITIES = Object.values(TenderModality);

const CITIES: Array<{ city: string; state: string }> = [
  { city: 'São Paulo', state: 'SP' },
  { city: 'Campinas', state: 'SP' },
  { city: 'Rio de Janeiro', state: 'RJ' },
  { city: 'Belo Horizonte', state: 'MG' },
  { city: 'Curitiba', state: 'PR' },
  { city: 'Porto Alegre', state: 'RS' },
  { city: 'Salvador', state: 'BA' },
  { city: 'Recife', state: 'PE' },
  { city: 'Fortaleza', state: 'CE' },
  { city: 'Goiânia', state: 'GO' },
];

const ORGS = [
  'Prefeitura Municipal',
  'Secretaria de Saúde',
  'Secretaria de Educação',
  'Governo do Estado',
  'Câmara Municipal',
  'Departamento de Obras',
  'Hospital Municipal',
  'Universidade Federal',
];

const CATEGORY_LABELS: Record<TenderCategory, string> = {
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

/**
 * Simula a busca diária de novos editais. Gera um lote de editais fictícios
 * plausíveis a cada execução — em produção, seria substituído (ou
 * complementado) por providers que realmente consultam PNCP, portais de
 * prefeitura/estado e diários oficiais, todos implementando ScraperSourceProvider.
 */
@Injectable()
export class MockScraperSourceProvider implements ScraperSourceProvider {
  readonly sourceName = 'Robô Mock (simulação)';

  async fetchTenders(): Promise<RawTenderData[]> {
    const batchSize = faker.number.int({ min: 2, max: 6 });
    return Array.from({ length: batchSize }, () => this.randomTender());
  }

  private randomTender(): RawTenderData {
    const location = faker.helpers.arrayElement(CITIES);
    const category = faker.helpers.arrayElement(CATEGORIES);
    const publicationDate = faker.date.recent({ days: 2 });
    const deadlineDate = faker.date.soon({ days: 30, refDate: publicationDate });
    const org = `${faker.helpers.arrayElement(ORGS)} de ${location.city}`;

    return {
      title: `${CATEGORY_LABELS[category]} - ${faker.company.catchPhrase()}`,
      description: faker.lorem.paragraph(),
      publicOrg: org,
      city: location.city,
      state: location.state,
      category,
      modality: faker.helpers.arrayElement(MODALITIES),
      estimatedValue: faker.number.float({ min: 5000, max: 2_000_000, fractionDigits: 2 }),
      publicationDate,
      deadlineDate,
      originalLink: `https://editais.exemplo.gov.br/edital/${faker.string.uuid()}`,
      status: TenderStatus.OPEN,
      source: this.sourceName,
    };
  }
}
