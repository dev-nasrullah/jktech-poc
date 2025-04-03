import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
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

    try {
      await firstValueFrom(
        this.client.send('create.ingestion', { documentId, userId }),
      );
    } catch (error) {
      throw new RpcException(error.message);
    }

    return this.response();
  }

  async getIngestions(id: string) {
    const result = await this.ingestionRepository.getIngestions(id);
    if (!result) {
      throw new NotFoundException('Ingestion not found');
    }

    return this.response(result);
  }
}
