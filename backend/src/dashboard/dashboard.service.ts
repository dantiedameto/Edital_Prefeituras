import { Injectable } from '@nestjs/common';
import { AlertStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { TendersService } from '../tenders/tenders.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tendersService: TendersService,
  ) {}

  async getSummary(userId: string) {
    const [totalTenders, newAlertsCount, favoritesCount, filtersCount, tendersNearDeadline, recentTenders, recentLogs] =
      await Promise.all([
        this.prisma.tender.count(),
        this.prisma.alert.count({ where: { userId, status: AlertStatus.NEW } }),
        this.prisma.favorite.count({ where: { userId } }),
        this.prisma.interestFilter.count({ where: { userId } }),
        this.tendersService.findNearDeadline(7),
        this.prisma.tender.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
        this.prisma.scraperLog.findMany({ orderBy: { startedAt: 'desc' }, take: 5 }),
      ]);

    return {
      totalTenders,
      newAlertsCount,
      favoritesCount,
      filtersCount,
      tendersNearDeadline,
      recentTenders,
      recentScraperLogs: recentLogs,
    };
  }
}
