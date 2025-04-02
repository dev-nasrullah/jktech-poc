import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Context } from '@/common/decorators/context.decorator';
import { LocalContext } from '@/common/@types/local-context.type';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Login success',
    example: {
      message: 'Success',
      token: 'token',
    },
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  login(@Body() _body: LoginDto, @Context() ctx: LocalContext) {
    return this.authService.login(ctx);
  }
}
