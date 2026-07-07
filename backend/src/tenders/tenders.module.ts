import { Module } from '@nestjs/common';
import { TendersService } from './tenders.service';
import { TendersController } from './tenders.controller';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [PlansModule],
  providers: [TendersService],
  controllers: [TendersController],
  exports: [TendersService],
})
export class TendersModule {}
