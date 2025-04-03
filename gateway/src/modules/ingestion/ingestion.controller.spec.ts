import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { NotFoundException } from '@nestjs/common';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { LocalContext } from '@/common/@types/local-context.type';
import { CaslGuard } from '@/common/guards/casl.guard';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '@/common/factory/casl-ability.factory';
import { PrismaService } from '@/database/prisma.service';

jest.mock('@/common/guards/casl.guard');
jest.mock('@/common/factory/casl-ability.factory');
jest.mock('@/database/prisma.service');

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestionService = {
    createIngestion: jest.fn(),
  };

  const mockCaslGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  const mockReflector = {
    get: jest.fn(),
  };

  const mockCaslAbilityFactory = {
    createForUser: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockIngestionService,
        },
        {
          provide: CaslGuard,
          useValue: mockCaslGuard,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: CaslAbilityFactory,
          useValue: mockCaslAbilityFactory,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const mockCreateIngestionDto: CreateIngestionDto = {
      documentId: '123e4567-e89b-12d3-a456-426614174000',
    };

    const mockContext: LocalContext = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'user',
      userId: '123e4567-e89b-12d3-a456-426614174000',
    };

    const mockResponse = {
      success: true,
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        documentId: mockCreateIngestionDto.documentId,
        userId: mockContext.id,
        status: 'pending',
      },
    };

    it('should create an ingestion successfully', async () => {
      mockIngestionService.createIngestion.mockResolvedValue(mockResponse);

      const result = await controller.create(
        mockCreateIngestionDto,
        mockContext,
      );

      expect(result).toEqual(mockResponse);
      expect(service.createIngestion).toHaveBeenCalledWith(
        mockCreateIngestionDto,
        mockContext.id,
      );
    });

    it('should throw NotFoundException when document is not found', async () => {
      mockIngestionService.createIngestion.mockRejectedValue(
        new NotFoundException('Document not found'),
      );

      await expect(
        controller.create(mockCreateIngestionDto, mockContext),
      ).rejects.toThrow(NotFoundException);
      expect(service.createIngestion).toHaveBeenCalledWith(
        mockCreateIngestionDto,
        mockContext.id,
      );
    });

    it('should handle invalid UUID format', async () => {
      const invalidDto: CreateIngestionDto = {
        documentId: 'invalid-uuid',
      };

      await expect(
        controller.create(invalidDto, mockContext),
      ).rejects.toThrow();
    });
  });
});
