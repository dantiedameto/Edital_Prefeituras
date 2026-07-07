import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { userToProfile } from './users.mapper';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.findUserOrThrow(userId);
    return userToProfile(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    await this.findUserOrThrow(userId);
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      include: { plan: true },
    });
    return userToProfile(user);
  }

  private async findUserOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }
}
