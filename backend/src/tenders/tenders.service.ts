import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlansService } from '../plans/plans.service';
import { QueryTendersDto } from './dto/query-tenders.dto';

@Injectable()
export class TendersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plansService: PlansService,
  ) {}

  async findAll(userId: string, query: QueryTendersDto) {
    const plan = await this.plansService.getUserPlan(userId);

    const where: Prisma.TenderWhereInput = {
      ...(query.city && { city: { equals: query.city, mode: 'insensitive' } }),
      ...(query.state && { state: { equals: query.state, mode: 'insensitive' } }),
      ...(query.category && { category: query.category }),
      ...(query.modality && { modality: query.modality }),
      ...(query.status && { status: query.status }),
      ...(query.keyword && {
        OR: [
          { title: { contains: query.keyword, mode: 'insensitive' } },
          { description: { contains: query.keyword, mode: 'insensitive' } },
          { publicOrg: { contains: query.keyword, mode: 'insensitive' } },
        ],
      }),
    };

    const totalMatching = await this.prisma.tender.count({ where });
    const effectiveTotal =
      plan.maxTenderResults !== null ? Math.min(totalMatching, plan.maxTenderResults) : totalMatching;

    const skip = (query.page - 1) * query.pageSize;
    const isBeyondPlanLimit = plan.maxTenderResults !== null && skip >= plan.maxTenderResults;

    const items = isBeyondPlanLimit
      ? []
      : await this.prisma.tender.findMany({
          where,
          orderBy: { publicationDate: 'desc' },
          skip,
          take:
            plan.maxTenderResults !== null
              ? Math.min(query.pageSize, plan.maxTenderResults - skip)
              : query.pageSize,
        });

    return {
      items,
      total: effectiveTotal,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.max(1, Math.ceil(effectiveTotal / query.pageSize)),
      limitedByPlan: plan.maxTenderResults !== null && totalMatching > plan.maxTenderResults,
    };
  }

  async findOne(id: string) {
    const tender = await this.prisma.tender.findUnique({ where: { id } });
    if (!tender) {
      throw new NotFoundException('Edital não encontrado.');
    }
    return tender;
  }

  findNearDeadline(daysAhead = 7) {
    const now = new Date();
    const limit = new Date();
    limit.setDate(limit.getDate() + daysAhead);
    return this.prisma.tender.findMany({
      where: {
        status: 'OPEN',
        deadlineDate: { gte: now, lte: limit },
      },
      orderBy: { deadlineDate: 'asc' },
      take: 10,
    });
  }
}
