import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.plan.findMany({ orderBy: { priceCents: 'asc' } });
  }

  async getUserPlan(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { plan: true },
    });
    return user.plan;
  }

  /** Garante que o usuário ainda pode cadastrar mais um filtro de interesse, respeitando o limite do plano. */
  async assertCanCreateFilter(userId: string) {
    const plan = await this.getUserPlan(userId);
    if (plan.maxFilters === null) {
      return;
    }
    const count = await this.prisma.interestFilter.count({ where: { userId } });
    if (count >= plan.maxFilters) {
      throw new ForbiddenException(
        `O plano ${plan.name} permite no máximo ${plan.maxFilters} filtros de interesse. Faça upgrade para o plano Premium para cadastrar filtros ilimitados.`,
      );
    }
  }

  /** Garante que o usuário ainda pode favoritar mais um edital, respeitando o limite do plano. */
  async assertCanCreateFavorite(userId: string) {
    const plan = await this.getUserPlan(userId);
    if (plan.maxFavorites === null) {
      return;
    }
    const count = await this.prisma.favorite.count({ where: { userId } });
    if (count >= plan.maxFavorites) {
      throw new ForbiddenException(
        `O plano ${plan.name} permite no máximo ${plan.maxFavorites} favoritos. Faça upgrade para o plano Premium para favoritos ilimitados.`,
      );
    }
  }
}
