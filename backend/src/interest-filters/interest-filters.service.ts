import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlansService } from '../plans/plans.service';
import { CreateInterestFilterDto } from './dto/create-interest-filter.dto';
import { UpdateInterestFilterDto } from './dto/update-interest-filter.dto';

@Injectable()
export class InterestFiltersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plansService: PlansService,
  ) {}

  findAllForUser(userId: string) {
    return this.prisma.interestFilter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateInterestFilterDto) {
    await this.plansService.assertCanCreateFilter(userId);
    return this.prisma.interestFilter.create({
      data: { ...dto, userId },
    });
  }

  async update(userId: string, id: string, dto: UpdateInterestFilterDto) {
    await this.findOwnedOrThrow(userId, id);
    return this.prisma.interestFilter.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOwnedOrThrow(userId, id);
    await this.prisma.interestFilter.delete({ where: { id } });
    return { success: true };
  }

  private async findOwnedOrThrow(userId: string, id: string) {
    const filter = await this.prisma.interestFilter.findUnique({ where: { id } });
    if (!filter) {
      throw new NotFoundException('Filtro não encontrado.');
    }
    if (filter.userId !== userId) {
      throw new ForbiddenException('Este filtro não pertence a você.');
    }
    return filter;
  }
}
