import { Controller } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateIngestionDto } from './dto/create-ingestion.dto';

@Controller()
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @MessagePattern('create.ingestion')
  create(data: CreateIngestionDto) {
    console.log('create.ingestion');

    return this.ingestionService.createIngestion(data);
  }

  @MessagePattern('get.ingestion')
  get(id: string) {
    return this.ingestionService.getIngestion(id);
  }
}
