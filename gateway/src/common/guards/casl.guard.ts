import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { CaslAbilityFactory } from '../factory/casl-ability.factory';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<
      [string, string][] | undefined
    >('permissions', context.getHandler());
    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Fetch user's role and permissions
    const userWithRoles = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!userWithRoles || !userWithRoles.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    const ability = this.caslAbilityFactory.createForUser(
      userWithRoles.role.rolePermissions,
    );

    for (const [action, subject] of requiredPermissions) {
      if (!ability.can(action as any, subject as any)) {
        throw new ForbiddenException(
          `Access Denied for ${action} on ${subject}`,
        );
      }
    }

    return true;
  }
}
