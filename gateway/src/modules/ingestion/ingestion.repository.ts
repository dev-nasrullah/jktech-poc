import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  getDocumentById(id: string) {
    return this.prisma.document.findUnique({
      where: {
        id,
      },
    });
  }

  getIngestions(id: string) {
    return this.prisma.ingestion.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });
  }
}
