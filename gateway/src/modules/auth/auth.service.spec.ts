import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LocalContext } from '@/common/@types/local-context.type';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let repository: AuthRepository;
  let jwtService: JwtService;

  const mockAuthRepository = {
    findUserByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<AuthRepository>(AuthRepository);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockHashedPassword = 'hashedPassword123';

    const mockUser = {
      id: 'user-123',
      email: mockEmail,
      password: mockHashedPassword,
      role: {
        name: 'user',
      },
      firstName: 'Test',
      lastName: 'User',
    };

    it('should validate user successfully', async () => {
      // Mock repository to return a user
      mockAuthRepository.findUserByEmail.mockResolvedValue(mockUser);
      // Mock bcrypt to return true for password comparison
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(mockEmail, mockPassword);

      expect(result).toEqual(mockUser);
      expect(repository.findUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPassword,
        mockHashedPassword,
      );
    });

    it('should throw NotFoundException when user is not found', async () => {
      // Mock repository to return null (user not found)
      mockAuthRepository.findUserByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser(mockEmail, mockPassword),
      ).rejects.toThrow(NotFoundException);

      expect(repository.findUserByEmail).toHaveBeenCalledWith(mockEmail);
      // Verify that bcrypt.compare was not called since user was not found
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Mock repository to return a user
      mockAuthRepository.findUserByEmail.mockResolvedValue(mockUser);
      // Mock bcrypt to return false for password comparison
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser(mockEmail, mockPassword),
      ).rejects.toThrow(UnauthorizedException);

      expect(repository.findUserByEmail).toHaveBeenCalledWith(mockEmail);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockPassword,
        mockHashedPassword,
      );
    });
  });

  describe('login', () => {
    const mockUser: LocalContext = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'user',
      firstName: 'Test',
      lastName: 'User',
    };

    const mockAccessToken = 'mock.jwt.token';

    it('should return access token and user data', () => {
      // Mock JWT service to return a token
      mockJwtService.sign.mockReturnValue(mockAccessToken);

      const result = service.login(mockUser);

      expect(result).toEqual({
        message: 'Success',
        data: {
          accessToken: mockAccessToken,
          user: {
            id: mockUser.id,
            email: mockUser.email,
            role: mockUser.role,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
          },
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });
  });
});
