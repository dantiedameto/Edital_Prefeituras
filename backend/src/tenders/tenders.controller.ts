import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TendersService } from './tenders.service';
import { QueryTendersDto } from './dto/query-tenders.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@ApiTags('tenders')
@ApiBearerAuth()
@Controller('tenders')
export class TendersController {
  constructor(private readonly tendersService: TendersService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryTendersDto) {
    return this.tendersService.findAll(user.id, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tendersService.findOne(id);
  }
}
