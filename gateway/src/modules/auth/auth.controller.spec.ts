import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalContext } from '@/common/@types/local-context.type';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const mockLoginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockContext: LocalContext = {
      id: 'user-123',
      email: mockLoginDto.email,
      role: 'user',
      firstName: 'Test',
      lastName: 'User',
    };

    const mockResponse = {
      success: true,
      data: {
        accessToken: 'mock.jwt.token',
        user: {
          id: mockContext.id,
          email: mockContext.email,
          role: mockContext.role,
          firstName: mockContext.firstName,
          lastName: mockContext.lastName,
        },
      },
    };

    it('should login successfully', async () => {
      // Mock service to return a successful response
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(mockLoginDto, mockContext);

      expect(result).toEqual(mockResponse);
      expect(service.login).toHaveBeenCalledWith(mockContext);
    });

    // it('should handle invalid email format', async () => {
    //   const invalidDto: LoginDto = {
    //     email: 'invalid-email',
    //     password: 'password123',
    //   };

    //   await expect(controller.login(invalidDto, mockContext)).rejects.toThrow();
    //   expect(service.login).not.toHaveBeenCalled();
    // });

    // it('should handle empty password', async () => {
    //   const invalidDto: LoginDto = {
    //     email: 'test@example.com',
    //     password: '',
    //   };

    //   await expect(controller.login(invalidDto, mockContext)).rejects.toThrow();
    //   expect(service.login).not.toHaveBeenCalled();
    // });

    it('should handle service errors', async () => {
      // Mock service to throw an error
      mockAuthService.login.mockRejectedValue(new Error('Service error'));

      await expect(
        controller.login(mockLoginDto, mockContext),
      ).rejects.toThrow();
      expect(service.login).toHaveBeenCalledWith(mockContext);
    });
  });
});
