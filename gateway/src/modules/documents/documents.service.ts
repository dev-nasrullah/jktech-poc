import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { DocumentsRepository } from './documents.repository';
import { BaseService } from '@/common/service/base.service';
import * as fs from 'fs';
import { rm, writeFile } from 'fs/promises';
import { UPLOAD } from '@/common/constants/upload.const';

@Injectable()
export class DocumentsService extends BaseService {
  constructor(private readonly documentsRepository: DocumentsRepository) {
    super();
  }

  async createDocument(file: Express.Multer.File) {
    const document = await this.documentsRepository.createDocument({
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });

    const ext = file.originalname.split('.').pop();
    const fileName = `${document.id}.${ext}`;
    file.path = `${UPLOAD.path}/${fileName}`;

    try {
      // ensure directory exists
      if (!fs.existsSync(UPLOAD.path)) {
        fs.mkdirSync(UPLOAD.path);
      }

      // save file to disk
      await writeFile(file.path, file.buffer);
    } catch (error) {
      // delete document
      await this.documentsRepository.removeDocument(document.id);
      throw new InternalServerErrorException(error);
    }

    return this.response();
  }

  async getAllDocument() {
    const documents = await this.documentsRepository.getAllDocument({
      select: {
        id: true,
        name: true,
        mimeType: true,
        size: true,
        createdAt: true,
      },
    });

    return this.response(documents);
  }

  async getDocumentById(id: string) {
    const document = await this.documentsRepository.getDocumentById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    // create read stream
    const ext = document.name.split('.').pop();
    const path = `${UPLOAD.path}/${document.id}.${ext}`;
    const stream = fs.createReadStream(path);

    return new StreamableFile(stream, {
      disposition: 'attachment',
      type: document.mimeType,
      length: document.size,
    });
  }

  async updateDocument(id: string, file: Express.Multer.File) {
    const document = await this.documentsRepository.getDocumentById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const ext = file.originalname.split('.').pop();
    const fileName = `${document.id}.${ext}`;
    file.path = `${UPLOAD.path}/${fileName}`;

    // remove file
    const oldExt = document.name.split('.').pop();
    const oldPath = `${UPLOAD.path}/${document.id}.${oldExt}`;
    await rm(oldPath);

    // save file to disk
    await writeFile(file.path, file.buffer);

    // update document
    await this.documentsRepository.updateDocument(id, {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    });

    return this.response();
  }

  async removeDocument(id: string) {
    const document = await this.documentsRepository.getDocumentById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const ext = document.name.split('.').pop();
    const path = `${UPLOAD.path}/${document.id}.${ext}`;
    await rm(path);

    await this.documentsRepository.removeDocument(id);

    return this.response();
  }
}
