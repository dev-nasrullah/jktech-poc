import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { ClientProxy } from '@nestjs/microservices';
import { IngestionRepository } from './ingestion.repository';
import { BaseService } from '@/common/service/base.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IngestionService extends BaseService {
  constructor(
    @Inject('INGESTION_SERVICE') private readonly client: ClientProxy,
    private readonly ingestionRepository: IngestionRepository,
  ) {
    super();
  }

  async createIngestion({ documentId }: CreateIngestionDto, userId: string) {
    const document = await this.ingestionRepository.getDocumentById(documentId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return firstValueFrom(
      this.client.send('create.ingestion', { documentId, userId }),
    );
  }
}
