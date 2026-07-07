import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QueueEvents } from 'bullmq';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { ScraperProcessor } from './scraper.processor';
import { ScraperScheduler } from './scraper.scheduler';
import { MockScraperSourceProvider } from './providers/mock-scraper-source.provider';
import { SCRAPER_SOURCE_PROVIDERS } from './providers/scraper-source.interface';
import { SCRAPER_QUEUE_EVENTS, SCRAPER_QUEUE_NAME } from './scraper.constants';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [
    AlertsModule,
    BullModule.registerQueue({ name: SCRAPER_QUEUE_NAME }),
  ],
  providers: [
    ScraperService,
    ScraperProcessor,
    ScraperScheduler,
    MockScraperSourceProvider,
    {
      // Lista de fontes de editais ativas. Para plugar uma fonte real (PNCP,
      // portal de prefeitura, diário oficial), basta implementar
      // ScraperSourceProvider e adicioná-la aqui.
      provide: SCRAPER_SOURCE_PROVIDERS,
      useFactory: (mockProvider: MockScraperSourceProvider) => [mockProvider],
      inject: [MockScraperSourceProvider],
    },
    {
      provide: SCRAPER_QUEUE_EVENTS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new QueueEvents(SCRAPER_QUEUE_NAME, {
          connection: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
        }),
    },
  ],
  controllers: [ScraperController],
})
export class ScraperModule {}
