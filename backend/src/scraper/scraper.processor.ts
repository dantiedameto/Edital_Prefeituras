import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SCRAPER_QUEUE_NAME } from './scraper.constants';
import { ScraperService } from './scraper.service';

@Processor(SCRAPER_QUEUE_NAME)
export class ScraperProcessor extends WorkerHost {
  private readonly logger = new Logger(ScraperProcessor.name);

  constructor(private readonly scraperService: ScraperService) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Processando job ${job.id} (${job.name})`);
    return this.scraperService.runScrapeCycle();
  }
}
