import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { BaseService } from '@/common/service/base.service';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService extends BaseService {
  constructor(private readonly usersRepository: UserRepository) {
    super();
  }

  async register(body: RegisterDto) {
    const { email, roleId, password } = body;

    const user = await this.usersRepository.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const role = await this.usersRepository.findRoleById(roleId);
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    await this.usersRepository.createUser({
      ...body,
      password: await bcrypt.hash(password, 10),
    });

    return this.response();
  }
}
