import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LocalContext } from '@/common/@types/local-context.type';
import { BaseService } from '@/common/service/base.service';

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  /**
   * Validates a user by their email and password.
   * @param email The email address of the user.
   * @param password The password of the user.
   * @returns The validated user.
   * @throws NotFoundException If the user is not found.
   * @throws UnauthorizedException If the password is invalid.
   */
  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  login(user: LocalContext) {
    return this.response({
      accessToken: this.jwtService.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }
}
