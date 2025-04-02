import { Module } from '@nestjs/common';
import { ModulesModule } from '@/modules/modules.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [ModulesModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
