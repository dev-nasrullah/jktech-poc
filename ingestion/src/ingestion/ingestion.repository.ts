import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

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
      INSERT INTO ingestions (id, document_id, user_id, updated_at) 
      VALUES (${uuid()}, ${documentId}, ${userId}, NOW())
      RETURNING id
    `;
  }

  updateIngestionStatus(id: string, status: 'SUCCESS' | 'FAILED') {
    return this.prisma
      .$executeRaw`UPDATE ingestions SET status = ${status}::"IngestionStatus" WHERE id = ${id}`;
  }

  async getIngestion(id: string) {
    const [result] = await this.prisma.$queryRaw<
      { id: string; status: string }[]
    >`
      SELECT id, status FROM ingestions WHERE id = ${id}
    `;

    return result;
  }
}
