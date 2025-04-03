import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { NotFoundException } from '@nestjs/common';
import { StreamableFile } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocumentsService = {
    createDocument: jest.fn(),
    getAllDocument: jest.fn(),
    getDocumentById: jest.fn(),
    updateDocument: jest.fn(),
    removeDocument: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDocument', () => {
    it('should create a document', async () => {
      const mockFile = {
        originalname: 'test.pdf',
        size: 1024,
        mimetype: 'application/pdf',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const expectedResponse = { success: true };
      mockDocumentsService.createDocument.mockResolvedValue(expectedResponse);

      const result = await controller.createDocument(mockFile);

      expect(result).toEqual(expectedResponse);
      expect(service.createDocument).toHaveBeenCalledWith(mockFile);
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

      mockDocumentsService.getAllDocument.mockResolvedValue({
        message: 'Success',
        data: mockDocuments,
      });

      const result = await controller.getAllDocument();

      expect(result).toEqual({
        message: 'Success',
        data: mockDocuments,
      });
      expect(service.getAllDocument).toHaveBeenCalled();
    });
  });

  describe('getDocumentById', () => {
    it('should return a document by id', async () => {
      const mockId = '123';
      const mockStream = new StreamableFile(Buffer.from('test'));

      mockDocumentsService.getDocumentById.mockResolvedValue(mockStream);

      const result = await controller.getDocumentById(mockId);

      expect(result).toBeInstanceOf(StreamableFile);
      expect(service.getDocumentById).toHaveBeenCalledWith(mockId);
    });

    it('should throw NotFoundException when document not found', async () => {
      const mockId = '123';
      mockDocumentsService.getDocumentById.mockRejectedValue(
        new NotFoundException('Document not found'),
      );

      await expect(controller.getDocumentById(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateDocument', () => {
    it('should update a document', async () => {
      const mockId = '123';
      const mockFile = {
        originalname: 'updated.pdf',
        size: 2048,
        mimetype: 'application/pdf',
        buffer: Buffer.from('updated'),
      } as Express.Multer.File;

      const expectedResponse = { success: true };
      mockDocumentsService.updateDocument.mockResolvedValue(expectedResponse);

      const result = await controller.updateDocument(mockId, mockFile);

      expect(result).toEqual(expectedResponse);
      expect(service.updateDocument).toHaveBeenCalledWith(mockId, mockFile);
    });

    it('should throw NotFoundException when document not found', async () => {
      const mockId = '123';
      const mockFile = {
        originalname: 'updated.pdf',
        size: 2048,
        mimetype: 'application/pdf',
        buffer: Buffer.from('updated'),
      } as Express.Multer.File;

      mockDocumentsService.updateDocument.mockRejectedValue(
        new NotFoundException('Document not found'),
      );

      await expect(controller.updateDocument(mockId, mockFile)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeDocument', () => {
    it('should remove a document', async () => {
      const mockId = '123';
      const expectedResponse = { success: true };
      mockDocumentsService.removeDocument.mockResolvedValue(expectedResponse);

      const result = await controller.removeDocument(mockId);

      expect(result).toEqual(expectedResponse);
      expect(service.removeDocument).toHaveBeenCalledWith(mockId);
    });

    it('should throw NotFoundException when document not found', async () => {
      const mockId = '123';
      mockDocumentsService.removeDocument.mockRejectedValue(
        new NotFoundException('Document not found'),
      );

      await expect(controller.removeDocument(mockId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
