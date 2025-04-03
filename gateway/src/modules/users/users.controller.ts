import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    example: {
      message: 'Success',
    },
  })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
  })
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}
