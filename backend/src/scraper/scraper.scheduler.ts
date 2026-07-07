import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { SCRAPER_JOB_NAME, SCRAPER_QUEUE_NAME } from './scraper.constants';

@Injectable()
export class ScraperScheduler {
  private readonly logger = new Logger(ScraperScheduler.name);

  constructor(@InjectQueue(SCRAPER_QUEUE_NAME) private readonly queue: Queue) {}

  @Cron(process.env.SCRAPER_CRON ?? '0 6 * * *')
  async triggerDailyScrape() {
    this.logger.log('Disparando busca diária agendada de editais.');
    await this.queue.add(SCRAPER_JOB_NAME, {});
  }
}
