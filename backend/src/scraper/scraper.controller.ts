import { Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Queue, QueueEvents } from 'bullmq';
import { ScraperService } from './scraper.service';
import { SCRAPER_JOB_NAME, SCRAPER_QUEUE_EVENTS, SCRAPER_QUEUE_NAME } from './scraper.constants';

@ApiTags('scraper')
@ApiBearerAuth()
@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly scraperService: ScraperService,
    @InjectQueue(SCRAPER_QUEUE_NAME) private readonly queue: Queue,
    @Inject(SCRAPER_QUEUE_EVENTS) private readonly queueEvents: QueueEvents,
  ) {}

  /** Dispara manualmente um ciclo de busca (usado na demo para simular a rotina diária) e aguarda o resultado. */
  @Post('run')
  async runNow() {
    const job = await this.queue.add(SCRAPER_JOB_NAME, {});
    const result = await job.waitUntilFinished(this.queueEvents, 30_000);
    return result;
  }

  @Get('logs')
  getLogs(@Query('limit') limit?: string) {
    return this.scraperService.getLogs(limit ? Number(limit) : 20);
  }
}
