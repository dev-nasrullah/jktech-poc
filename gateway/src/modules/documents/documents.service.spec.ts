import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { DocumentsRepository } from './documents.repository';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { rm, writeFile } from 'fs/promises';
import { UPLOAD } from '@/common/constants/upload.const';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('@/database/prisma.service');

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repository: DocumentsRepository;

  const mockDocumentsRepository = {
    createDocument: jest.fn(),
    getAllDocument: jest.fn(),
    getDocumentById: jest.fn(),
    updateDocument: jest.fn(),
    removeDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: DocumentsRepository,
          useValue: mockDocumentsRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repository = module.get<DocumentsRepository>(DocumentsRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDocument', () => {
    const mockFile = {
      originalname: 'test.pdf',
      size: 1024,
      mimetype: 'application/pdf',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const mockDocument = {
      id: '123',
      name: 'test.pdf',
      size: 1024,
      mimeType: 'application/pdf',
    };

    it('should create a document successfully', async () => {
      mockDocumentsRepository.createDocument.mockResolvedValue(mockDocument);
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await service.createDocument(mockFile);

      expect(result).toEqual({ message: 'Success' });
      expect(repository.createDocument).toHaveBeenCalledWith({
        name: mockFile.originalname,
        size: mockFile.size,
        mimeType: mockFile.mimetype,
      });
      expect(fs.existsSync).toHaveBeenCalledWith(UPLOAD.path);
      expect(fs.mkdirSync).toHaveBeenCalledWith(UPLOAD.path);
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining(`${mockDocument.id}.pdf`),
        mockFile.buffer,
      );
    });

    it('should handle file system errors', async () => {
      mockDocumentsRepository.createDocument.mockResolvedValue(mockDocument);
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      (fs.mkdirSync as jest.Mock).mockImplementation(() => {});
      (writeFile as jest.Mock).mockRejectedValue(
        new Error('File system error'),
      );

      await expect(service.createDocument(mockFile)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(repository.removeDocument).toHaveBeenCalledWith(mockDocument.id);
    });
  });

  describe('getAllDocument', () => {
    it('should return all documents', async () => {
      const mockDocuments = [
        {
          id: '1',
          name: 'test.pdf',
          mimeType: 'application/pdf',
          size: 1024,
          createdAt: new Date(),
        },
      ];

      mockDocumentsRepository.getAllDocument.mockResolvedValue(mockDocuments);

      const result = await service.getAllDocument();

      expect(result).toEqual({
        message: 'Success',
        data: mockDocuments,
      });
      expect(repository.getAllDocument).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          mimeType: true,
          size: true,
          createdAt: true,
        },
      });
    });
  });

  describe('getDocumentById', () => {
    const mockId = '123';
    const mockDocument = {
      id: mockId,
      name: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1024,
    };

    it('should return a document stream', async () => {
      mockDocumentsRepository.getDocumentById.mockResolvedValue(mockDocument);
      (fs.createReadStream as jest.Mock).mockReturnValue({
        pipe: jest.fn(),
      });

      const result = await service.getDocumentById(mockId);

      expect(result).toBeInstanceOf(StreamableFile);
      expect(repository.getDocumentById).toHaveBeenCalledWith(mockId);
      expect(fs.createReadStream).toHaveBeenCalledWith(
        expect.stringContaining(`${mockId}.pdf`),
      );
    });

    it('should throw NotFoundException when document not found', async () => {
      mockDocumentsRepository.getDocumentById.mockResolvedValue(null);

      await expect(service.getDocumentById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateDocument', () => {
    const mockId = '123';
    const mockFile = {
      originalname: 'updated.pdf',
      size: 2048,
      mimetype: 'application/pdf',
      buffer: Buffer.from('updated'),
    } as Express.Multer.File;

    const mockDocument = {
      id: mockId,
      name: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1024,
    };

    it('should update a document successfully', async () => {
      mockDocumentsRepository.getDocumentById.mockResolvedValue(mockDocument);
      (rm as jest.Mock).mockResolvedValue(undefined);
      (writeFile as jest.Mock).mockResolvedValue(undefined);
      mockDocumentsRepository.updateDocument.mockResolvedValue({
        ...mockDocument,
        name: mockFile.originalname,
        size: mockFile.size,
        mimeType: mockFile.mimetype,
      });

      const result = await service.updateDocument(mockId, mockFile);

      expect(result).toEqual({ message: 'Success' });
      expect(repository.getDocumentById).toHaveBeenCalledWith(mockId);
      expect(rm).toHaveBeenCalledWith(expect.stringContaining(`${mockId}.pdf`));
      expect(writeFile).toHaveBeenCalledWith(
        expect.stringContaining(`${mockId}.pdf`),
        mockFile.buffer,
      );
      expect(repository.updateDocument).toHaveBeenCalledWith(mockId, {
        name: mockFile.originalname,
        size: mockFile.size,
        mimeType: mockFile.mimetype,
      });
    });

    it('should throw NotFoundException when document not found', async () => {
      mockDocumentsRepository.getDocumentById.mockResolvedValue(null);

      await expect(service.updateDocument(mockId, mockFile)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeDocument', () => {
    const mockId = '123';
    const mockDocument = {
      id: mockId,
      name: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1024,
    };

    it('should remove a document successfully', async () => {
      mockDocumentsRepository.getDocumentById.mockResolvedValue(mockDocument);
      (rm as jest.Mock).mockResolvedValue(undefined);
      mockDocumentsRepository.removeDocument.mockResolvedValue(mockDocument);

      const result = await service.removeDocument(mockId);

      expect(result).toEqual({ message: 'Success' });
      expect(repository.getDocumentById).toHaveBeenCalledWith(mockId);
      expect(rm).toHaveBeenCalledWith(expect.stringContaining(`${mockId}.pdf`));
      expect(repository.removeDocument).toHaveBeenCalledWith(mockId);
    });

    it('should throw NotFoundException when document not found', async () => {
      mockDocumentsRepository.getDocumentById.mockResolvedValue(null);

      await expect(service.removeDocument(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
