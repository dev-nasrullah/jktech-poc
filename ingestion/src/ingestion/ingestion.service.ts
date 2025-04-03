import { Injectable } from '@nestjs/common';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IngestionRepository } from './ingestion.repository';

@Injectable()
export class IngestionService {
  constructor(
    private readonly ingestionRepository: IngestionRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createIngestion(data: CreateIngestionDto) {
    const [result] = await this.ingestionRepository.createIngestion(data);

    this.eventEmitter.emit('ingestion.created', { id: result.id });

    return result;
  }

  async getIngestion(id: string) {
    const result = await this.ingestionRepository.getIngestion(id);

    if (!result) {
      throw new Error('Ingestion not found');
    }

    return result;
  }
}
