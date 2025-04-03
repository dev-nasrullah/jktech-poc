import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { IngestionRepository } from './ingestion.repository';
import { PrismaModule } from '@/database/prisma.module';
import { EventService } from './event-handler/event.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [PrismaModule, EventEmitterModule.forRoot()],
  controllers: [IngestionController],
  providers: [IngestionService, IngestionRepository, EventService],
})
export class IngestionModule {}
