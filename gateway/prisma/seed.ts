import { PERMISSIONS } from '@/common/constants/permission.const';
import { ROLES } from '@/common/constants/role.const';
import { ACCESS_TYPE } from '@/common/enum/access-type.enum';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // create roles
    await prisma.role.createMany({
      data: ROLES,
    });

    // create permissions
    await prisma.permission.createMany({
      data: PERMISSIONS,
    });

    // role permissions map
    await prisma.rolePermission.createMany({
      data: [
        // Admin all permissions
        { accessType: ACCESS_TYPE.READ, roleId: '1', permissionId: '1' },
        { accessType: ACCESS_TYPE.WRITE, roleId: '1', permissionId: '1' },
        { accessType: ACCESS_TYPE.UPDATE, roleId: '1', permissionId: '1' },
        { accessType: ACCESS_TYPE.DELETE, roleId: '1', permissionId: '1' },

        { accessType: ACCESS_TYPE.READ, roleId: '1', permissionId: '2' },
        { accessType: ACCESS_TYPE.WRITE, roleId: '1', permissionId: '2' },
        { accessType: ACCESS_TYPE.UPDATE, roleId: '1', permissionId: '2' },
        { accessType: ACCESS_TYPE.READ, roleId: '1', permissionId: '2' },

        { accessType: ACCESS_TYPE.READ, roleId: '1', permissionId: '3' },
        { accessType: ACCESS_TYPE.WRITE, roleId: '1', permissionId: '3' },
        { accessType: ACCESS_TYPE.UPDATE, roleId: '1', permissionId: '3' },
        { accessType: ACCESS_TYPE.DELETE, roleId: '1', permissionId: '3' },

        // Editor (read, write, update and delete) documents
        { accessType: ACCESS_TYPE.READ, roleId: '2', permissionId: '1' },
        { accessType: ACCESS_TYPE.WRITE, roleId: '2', permissionId: '1' },
        { accessType: ACCESS_TYPE.UPDATE, roleId: '2', permissionId: '1' },
        { accessType: ACCESS_TYPE.DELETE, roleId: '2', permissionId: '1' },
        { accessType: ACCESS_TYPE.READ, roleId: '2', permissionId: '2' },
        { accessType: ACCESS_TYPE.WRITE, roleId: '2', permissionId: '2' },

        // Viewer (read) documents
        { accessType: ACCESS_TYPE.READ, roleId: '3', permissionId: '1' },
        { accessType: ACCESS_TYPE.READ, roleId: '3', permissionId: '2' },
      ],
    });

    // create users
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: await bcrypt.hash('password', 10),
        roleId: '1',
      },
    });
  } catch (error) {
    console.error('Error seeding', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
