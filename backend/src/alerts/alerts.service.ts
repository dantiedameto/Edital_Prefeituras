import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AlertStatus, InterestFilter, Tender } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  findAllForUser(userId: string) {
    return this.prisma.alert.findMany({
      where: { userId },
      include: { tender: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(userId: string, id: string, status: AlertStatus) {
    const alert = await this.prisma.alert.findUnique({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alerta não encontrado.');
    }
    if (alert.userId !== userId) {
      throw new ForbiddenException('Este alerta não pertence a você.');
    }
    return this.prisma.alert.update({ where: { id }, data: { status } });
  }

  /**
   * Motor de matching: para cada edital novo, verifica quais filtros de interesse
   * dos usuários batem com ele e cria um alerta (evitando duplicidade). Campos do
   * filtro que não foram preenchidos pelo usuário são ignorados na comparação.
   */
  async matchTendersToFilters(tenders: Tender[]): Promise<number> {
    if (tenders.length === 0) {
      return 0;
    }

    const filters = await this.prisma.interestFilter.findMany({
      include: { user: { include: { plan: true } } },
    });

    let alertsCreated = 0;

    for (const tender of tenders) {
      const matchingFilters = filters.filter((filter) => this.tenderMatchesFilter(tender, filter));
      const uniqueUserIds = [...new Set(matchingFilters.map((filter) => filter.userId))];

      for (const userId of uniqueUserIds) {
        const existing = await this.prisma.alert.findUnique({
          where: { userId_tenderId: { userId, tenderId: tender.id } },
        });
        if (existing) continue;

        await this.prisma.alert.create({ data: { userId, tenderId: tender.id } });
        alertsCreated += 1;

        const matchingFilter = matchingFilters.find((filter) => filter.userId === userId)!;
        if (matchingFilter.user.plan.emailAlertsEnabled) {
          await this.mailerService.sendAlertEmail(matchingFilter.user.email, tender).catch((error) => {
            this.logger.error(`Falha ao enviar e-mail de alerta para ${matchingFilter.user.email}`, error);
          });
        }
      }
    }

    return alertsCreated;
  }

  private tenderMatchesFilter(tender: Tender, filter: InterestFilter): boolean {
    if (filter.city && filter.city.toLowerCase() !== tender.city.toLowerCase()) return false;
    if (filter.state && filter.state.toLowerCase() !== tender.state.toLowerCase()) return false;
    if (filter.category && filter.category !== tender.category) return false;
    if (filter.modality && filter.modality !== tender.modality) return false;
    if (filter.publicOrg && !tender.publicOrg.toLowerCase().includes(filter.publicOrg.toLowerCase())) return false;
    if (filter.minValue && Number(tender.estimatedValue) < Number(filter.minValue)) return false;
    if (filter.maxValue && Number(tender.estimatedValue) > Number(filter.maxValue)) return false;
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      const haystack = `${tender.title} ${tender.description}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  }
}
