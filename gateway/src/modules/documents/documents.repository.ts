import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Document, Prisma } from '@prisma/client';

@Injectable()
export class DocumentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createDocument(data: Pick<Document, 'name' | 'size' | 'mimeType'>) {
    return this.prisma.document.create({
      data,
    });
  }

  getAllDocument({
    select,
    where,
  }: {
    select: Prisma.DocumentSelect;
    where?: Prisma.DocumentWhereInput;
  }) {
    return this.prisma.document.findMany({
      where,
      select,
    });
  }

  getDocumentById(id: string) {
    return this.prisma.document.findUnique({
      where: {
        id,
      },
    });
  }

  removeDocument(id: string) {
    return this.prisma.document.delete({
      where: {
        id,
      },
    });
  }

  updateDocument(id: string, data: Prisma.DocumentUpdateInput) {
    return this.prisma.document.update({
      where: {
        id,
      },
      data,
    });
  }
}
