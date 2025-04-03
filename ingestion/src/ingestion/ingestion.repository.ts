import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IngestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  createIngestion({
    documentId,
    userId,
  }: {
    documentId: string;
    userId: string;
  }) {
    return this.prisma.$queryRaw<{ id: string }[]>`
      INSERT INTO ingestion (document_id, user_id, updated_at) 
      VALUES (${documentId}, ${userId}, NOW())
      RETURNING id
    `;
  }

  updateIngestionStatus(id: string, status: 'SUCCESS' | 'FAILED') {
    return this.prisma
      .$executeRaw`UPDATE ingestion SET status = ${status} WHERE id = ${id}`;
  }

  async getIngestion(id: string) {
    const [result] = await this.prisma.$queryRaw<
      { id: string; status: string }[]
    >`
      SELECT id, status FROM ingestion WHERE id = ${id}
    `;

    return result;
  }
}
