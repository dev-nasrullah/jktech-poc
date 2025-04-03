import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';
import { BadRequestException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { ROLES } from '@/common/constants/role.const';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    findUserByEmail: jest.fn(),
    findRoleById: jest.fn(),
    createUser: jest.fn(),
    getAllUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const mockRegisterDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      roleId: ROLES[0].id,
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully register a new user', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.findRoleById.mockResolvedValue({
        id: 1,
        name: 'user',
      });
      mockUserRepository.createUser.mockResolvedValue({
        id: 1,
        ...mockRegisterDto,
      });

      const result = await service.register(mockRegisterDto);

      expect(result).toBeDefined();
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
        mockRegisterDto.email,
      );
      expect(mockUserRepository.findRoleById).toHaveBeenCalledWith(
        mockRegisterDto.roleId,
      );
      expect(mockUserRepository.createUser).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user already exists', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue({
        id: 1,
        ...mockRegisterDto,
      });

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if role not found', async () => {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.findRoleById.mockResolvedValue(null);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: { name: 'user' },
        },
      ];

      mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);

      const result = await service.getUsers();

      expect(result).toBeDefined();
      expect(result.data).toEqual(mockUsers);
      expect(mockUserRepository.getAllUsers).toHaveBeenCalledWith({
        where: { deletedAt: null },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });
    });
  });
});
