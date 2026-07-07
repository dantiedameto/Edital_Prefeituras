import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { userToProfile } from '../users/users.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Já existe uma conta cadastrada com este e-mail.');
    }

    const freePlan = await this.prisma.plan.findUnique({ where: { slug: 'free' } });
    if (!freePlan) {
      throw new Error('Plano gratuito não encontrado. Rode o seed do banco de dados.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash,
        city: dto.city,
        state: dto.state,
        companyType: dto.companyType,
        planId: freePlan.id,
      },
      include: { plan: true },
    });

    return this.buildAuthResponse(user.id, user.email, user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { plan: true },
    });
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return this.buildAuthResponse(user.id, user.email, user);
  }

  private buildAuthResponse(userId: string, email: string, user: Parameters<typeof userToProfile>[0]) {
    const accessToken = this.jwtService.sign({ sub: userId, email });
    return {
      accessToken,
      user: userToProfile(user),
    };
  }
}
