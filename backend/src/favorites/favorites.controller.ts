import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.findAllForUser(user.id);
  }

  @Post(':tenderId')
  create(@CurrentUser() user: AuthenticatedUser, @Param('tenderId') tenderId: string) {
    return this.favoritesService.create(user.id, tenderId);
  }

  @Delete(':tenderId')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('tenderId') tenderId: string) {
    return this.favoritesService.remove(user.id, tenderId);
  }
}
