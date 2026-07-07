import { Inject, Injectable, Logger } from '@nestjs/common';
import { ScraperLogStatus, Tender } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AlertsService } from '../alerts/alerts.service';
import { RawTenderData, SCRAPER_SOURCE_PROVIDERS, ScraperSourceProvider } from './providers/scraper-source.interface';

export interface ScrapeRunResult {
  logId: string;
  tendersFound: number;
  tendersCreated: number;
  alertsCreated: number;
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly alertsService: AlertsService,
    @Inject(SCRAPER_SOURCE_PROVIDERS) private readonly providers: ScraperSourceProvider[],
  ) {}

  /** Executa um ciclo completo de busca: coleta, deduplica, salva, loga e dispara alertas. */
  async runScrapeCycle(): Promise<ScrapeRunResult> {
    const sourceNames = this.providers.map((provider) => provider.sourceName).join(', ');
    const log = await this.prisma.scraperLog.create({
      data: { source: sourceNames, status: ScraperLogStatus.RUNNING },
    });

    this.logger.log(`Iniciando ciclo de busca (log ${log.id}) — fontes: ${sourceNames}`);

    try {
      const rawResults = (await Promise.all(this.providers.map((provider) => provider.fetchTenders()))).flat();
      const createdTenders = await this.saveNewTenders(rawResults);
      const alertsCreated = await this.alertsService.matchTendersToFilters(createdTenders);

      await this.prisma.scraperLog.update({
        where: { id: log.id },
        data: {
          status: ScraperLogStatus.SUCCESS,
          finishedAt: new Date(),
          tendersFound: rawResults.length,
          tendersCreated: createdTenders.length,
        },
      });

      this.logger.log(
        `Ciclo concluído: ${rawResults.length} encontrados, ${createdTenders.length} novos, ${alertsCreated} alertas criados.`,
      );

      return { logId: log.id, tendersFound: rawResults.length, tendersCreated: createdTenders.length, alertsCreated };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      this.logger.error(`Ciclo de busca falhou: ${message}`);
      await this.prisma.scraperLog.update({
        where: { id: log.id },
        data: { status: ScraperLogStatus.FAILED, finishedAt: new Date(), errorMessage: message },
      });
      throw error;
    }
  }

  getLogs(limit = 20) {
    return this.prisma.scraperLog.findMany({ orderBy: { startedAt: 'desc' }, take: limit });
  }

  /** Insere apenas editais que ainda não existem, deduplicando por link original ou por título+órgão+data. */
  private async saveNewTenders(rawTenders: RawTenderData[]): Promise<Tender[]> {
    const created: Tender[] = [];

    for (const raw of rawTenders) {
      const existing = await this.prisma.tender.findFirst({
        where: {
          OR: [
            { originalLink: raw.originalLink },
            { title: raw.title, publicOrg: raw.publicOrg, publicationDate: raw.publicationDate },
          ],
        },
      });
      if (existing) continue;

      const tender = await this.prisma.tender.create({ data: raw });
      created.push(tender);
    }

    return created;
  }
}
