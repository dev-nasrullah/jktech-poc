import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CaslGuard } from '@/common/guards/casl.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ACCESS_TYPE } from '@/common/enum/access-type.enum';
import { PERMISSION } from '@/common/enum/permission.enum';

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
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.WRITE, PERMISSION.User])
  register(@Body() body: RegisterDto) {
    return this.usersService.register(body);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Get all users',
  })
  @Get()
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.READ, PERMISSION.User])
  getUsers() {
    return this.usersService.getUsers();
  }
}
