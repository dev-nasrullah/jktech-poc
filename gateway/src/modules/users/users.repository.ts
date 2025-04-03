import { PrismaService } from '@/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find a user by email.
   *
   * @param email The email address of the user.
   * @returns The user with the given email address, or null if no such user exists.
   */
  findUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });
  }

  findRoleById(id: string) {
    return this.prisma.role.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  createUser(data: {
    email: string;
    firstName: string;
    lastName: string | null;
    password: string;
    roleId: string;
  }) {
    return this.prisma.user.create({
      data,
    });
  }

  getAllUsers({
    select,
    where,
  }: {
    select: Prisma.UserSelect;
    where?: Prisma.UserWhereInput;
  }) {
    return this.prisma.user.findMany({
      where,
      select,
    });
  }
}
