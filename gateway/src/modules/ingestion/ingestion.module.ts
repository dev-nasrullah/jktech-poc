import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { PrismaModule } from '@/database/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IngestionRepository } from './ingestion.repository';
import { CaslModule } from '@/common/casl/casl.module';

@Module({
  imports: [
    PrismaModule,
    CaslModule,
    ClientsModule.register({
      clients: [
        {
          name: 'INGESTION_SERVICE',
          transport: Transport.TCP,
          options: {
            host: 'microservice',
            port: 3001,
          },
        },
      ],
    }),
  ],
  controllers: [IngestionController],
  providers: [IngestionService, IngestionRepository],
})
export class IngestionModule {}
