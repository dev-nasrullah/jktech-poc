import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentsRepository } from './documents.repository';
import { PrismaModule } from '@/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentsRepository],
})
export class DocumentsModule {}
