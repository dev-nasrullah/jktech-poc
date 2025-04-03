import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { IngestionRepository } from './ingestion.repository';
import { NotFoundException } from '@nestjs/common';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';

describe('IngestionService', () => {
  let service: IngestionService;
  let repository: IngestionRepository;
  let client: ClientProxy;

  const mockIngestionRepository = {
    getDocumentById: jest.fn(),
  };

  const mockClientProxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: IngestionRepository,
          useValue: mockIngestionRepository,
        },
        {
          provide: 'INGESTION_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repository = module.get<IngestionRepository>(IngestionRepository);
    client = module.get<ClientProxy>('INGESTION_SERVICE');

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createIngestion', () => {
    const mockCreateIngestionDto: CreateIngestionDto = {
      documentId: '123e4567-e89b-12d3-a456-426614174000',
    };

    const mockUserId = 'user-123';

    const mockDocument = {
      id: mockCreateIngestionDto.documentId,
      name: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1024,
    };

    const mockIngestionResponse = {
      message: 'Success',
    };

    it('should create an ingestion successfully', async () => {
      // Mock repository to return a document
      mockIngestionRepository.getDocumentById.mockResolvedValue(mockDocument);
      // Mock client proxy to return a successful response
      mockClientProxy.send.mockReturnValue(of(mockIngestionResponse));

      const result = await service.createIngestion(
        mockCreateIngestionDto,
        mockUserId,
      );

      expect(result).toEqual(mockIngestionResponse);
      expect(repository.getDocumentById).toHaveBeenCalledWith(
        mockCreateIngestionDto.documentId,
      );
      expect(client.send).toHaveBeenCalledWith('create.ingestion', {
        documentId: mockCreateIngestionDto.documentId,
        userId: mockUserId,
      });
    });

    it('should throw NotFoundException when document is not found', async () => {
      // Mock repository to return null (document not found)
      mockIngestionRepository.getDocumentById.mockResolvedValue(null);

      await expect(
        service.createIngestion(mockCreateIngestionDto, mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(repository.getDocumentById).toHaveBeenCalledWith(
        mockCreateIngestionDto.documentId,
      );
      // Verify that client.send was not called since document was not found
      expect(client.send).not.toHaveBeenCalled();
    });
  });
});
