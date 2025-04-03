import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IngestionRepository } from '../ingestion.repository';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);
  constructor(private readonly ingestionRepository: IngestionRepository) {}

  @OnEvent('ingestion.created', { async: true })
  async handleIngestionCreated({ id }: { id: string }) {
    const status = Math.random() > 0.5 ? 'SUCCESS' : 'FAILED';

    await this.sleep(2000);

    await this.ingestionRepository.updateIngestionStatus(id, status);

    this.logger.log(`Ingestion ${id} updated with status ${status}`);
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
