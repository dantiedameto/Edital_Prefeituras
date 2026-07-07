import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlansService } from '../plans/plans.service';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plansService: PlansService,
  ) {}

  findAllForUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { tender: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, tenderId: string) {
    const tender = await this.prisma.tender.findUnique({ where: { id: tenderId } });
    if (!tender) {
      throw new NotFoundException('Edital não encontrado.');
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_tenderId: { userId, tenderId } },
    });
    if (existing) {
      throw new ConflictException('Este edital já está nos seus favoritos.');
    }

    await this.plansService.assertCanCreateFavorite(userId);

    return this.prisma.favorite.create({ data: { userId, tenderId }, include: { tender: true } });
  }

  async remove(userId: string, tenderId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_tenderId: { userId, tenderId } },
    });
    if (!existing) {
      throw new NotFoundException('Favorito não encontrado.');
    }
    await this.prisma.favorite.delete({ where: { id: existing.id } });
    return { success: true };
  }
}
