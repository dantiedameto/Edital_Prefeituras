import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InterestFiltersService } from './interest-filters.service';
import { CreateInterestFilterDto } from './dto/create-interest-filter.dto';
import { UpdateInterestFilterDto } from './dto/update-interest-filter.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('interest-filters')
@ApiBearerAuth()
@Controller('interest-filters')
export class InterestFiltersController {
  constructor(private readonly interestFiltersService: InterestFiltersService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.interestFiltersService.findAllForUser(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateInterestFilterDto) {
    return this.interestFiltersService.create(user.id, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateInterestFilterDto) {
    return this.interestFiltersService.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.interestFiltersService.remove(user.id, id);
  }
}
