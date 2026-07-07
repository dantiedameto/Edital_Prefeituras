import { PrismaClient, TenderCategory, TenderModality, TenderStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

function randomTender() {
  const location = faker.helpers.arrayElement(CITIES);
  const category = faker.helpers.arrayElement(CATEGORIES);
  const publicationDate = faker.date.recent({ days: 30 });
  const deadlineDate = faker.date.soon({ days: 30, refDate: publicationDate });
  const org = `${faker.helpers.arrayElement(ORGS)} de ${location.city}`;

  return {
    title: `${categoryLabel(category)} - ${faker.company.catchPhrase()}`,
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
    source: 'Seed inicial (mock)',
    status: faker.helpers.arrayElement([TenderStatus.OPEN, TenderStatus.OPEN, TenderStatus.IN_REVIEW, TenderStatus.CLOSED]),
  };
}

function categoryLabel(category: TenderCategory): string {
  const labels: Record<TenderCategory, string> = {
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
  return labels[category];
}

async function main() {
  console.log('Seed: criando planos...');
  const freePlan = await prisma.plan.upsert({
    where: { slug: 'free' },
    update: {},
    create: {
      name: 'Gratuito',
      slug: 'free',
      maxFilters: 3,
      maxFavorites: 8,
      maxTenderResults: 20,
      emailAlertsEnabled: false,
      priceCents: 0,
    },
  });

  await prisma.plan.upsert({
    where: { slug: 'premium' },
    update: {},
    create: {
      name: 'Premium',
      slug: 'premium',
      maxFilters: null,
      maxFavorites: null,
      maxTenderResults: null,
      emailAlertsEnabled: true,
      priceCents: 9900,
    },
  });

  console.log('Seed: criando usuário de demonstração...');
  const passwordHash = await bcrypt.hash('senha123', 10);
  await prisma.user.upsert({
    where: { email: 'demo@centraldeeditais.com.br' },
    update: {},
    create: {
      name: 'Usuário Demonstração',
      email: 'demo@centraldeeditais.com.br',
      passwordHash,
      city: 'São Paulo',
      state: 'SP',
      companyType: 'Prestador de serviços',
      planId: freePlan.id,
    },
  });

  console.log('Seed: criando editais fictícios...');
  const existing = await prisma.tender.count();
  if (existing === 0) {
    const tenders = Array.from({ length: 18 }, randomTender);
    for (const tender of tenders) {
      await prisma.tender.create({ data: tender });
    }
  }

  console.log('Seed concluído.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
