import { PERMISSIONS } from '../src/common/constants/permission.const';
import { ROLES } from '../src/common/constants/role.const';
import { ACCESS_TYPE } from '../src/common/enum/access-type.enum';
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
        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.WRITE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.UPDATE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.DELETE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[0].id,
        },

        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[1].id,
        },
        {
          accessType: ACCESS_TYPE.WRITE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[1].id,
        },
        {
          accessType: ACCESS_TYPE.UPDATE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[1].id,
        },
        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[1].id,
        },

        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[2].id,
        },
        {
          accessType: ACCESS_TYPE.WRITE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[2].id,
        },
        {
          accessType: ACCESS_TYPE.UPDATE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[2].id,
        },
        {
          accessType: ACCESS_TYPE.DELETE,
          roleId: ROLES[0].id,
          permissionId: PERMISSIONS[2].id,
        },

        // Editor (read, write, update and delete) documents
        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[1].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.WRITE,
          roleId: ROLES[1].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.UPDATE,
          roleId: ROLES[1].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.DELETE,
          roleId: ROLES[1].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[1].id,
          permissionId: PERMISSIONS[1].id,
        },
        {
          accessType: ACCESS_TYPE.WRITE,
          roleId: ROLES[1].id,
          permissionId: PERMISSIONS[1].id,
        },

        // Viewer (read) documents
        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[2].id,
          permissionId: PERMISSIONS[0].id,
        },
        {
          accessType: ACCESS_TYPE.READ,
          roleId: ROLES[2].id,
          permissionId: PERMISSIONS[1].id,
        },
      ],
    });

    // create users
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        password: await bcrypt.hash('password', 10),
        roleId: ROLES[0].id,
      },
    });
  } catch (error) {
    console.error('Error seeding', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
