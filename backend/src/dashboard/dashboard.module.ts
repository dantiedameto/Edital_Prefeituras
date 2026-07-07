import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TendersModule } from '../tenders/tenders.module';

@Module({
  imports: [TendersModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
