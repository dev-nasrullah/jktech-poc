import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ROLES } from '@/common/constants/role.const';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    register: jest.fn(),
    getUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123',
      roleId: ROLES[0].id,
    };

    it('should call service.register with correct parameters', async () => {
      const expectedResponse = { message: 'Success' };
      mockUsersService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(result).toBe(expectedResponse);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const expectedResponse = {
        message: 'Success',
        data: [
          {
            id: '1',
            email: 'user1@example.com',
            firstName: 'User',
            lastName: 'One',
            role: { name: 'admin' },
          },
        ],
      };
      mockUsersService.getUsers.mockResolvedValue(expectedResponse);

      const result = await controller.getUsers();

      expect(result).toBe(expectedResponse);
      expect(service.getUsers).toHaveBeenCalled();
    });
  });
});
