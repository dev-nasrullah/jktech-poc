import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '@/database/prisma.module';
import { UserRepository } from './users.repository';
import { CaslModule } from '@/common/casl/casl.module';

@Module({
  imports: [PrismaModule, CaslModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}
