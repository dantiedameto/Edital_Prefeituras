import { Module } from '@nestjs/common';
import { InterestFiltersService } from './interest-filters.service';
import { InterestFiltersController } from './interest-filters.controller';
import { PlansModule } from '../plans/plans.module';

@Module({
  imports: [PlansModule],
  providers: [InterestFiltersService],
  controllers: [InterestFiltersController],
  exports: [InterestFiltersService],
})
export class InterestFiltersModule {}
