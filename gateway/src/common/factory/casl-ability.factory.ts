import {
  Ability,
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { RolePermission, Permission } from '@prisma/client';
import { ACCESS_TYPE } from '../enum/access-type.enum';

type Subjects = InferSubjects<Permission> | 'all';

export type AppAbility = Ability<[ACCESS_TYPE, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(
    rolePermissions: (RolePermission & { permission: Permission })[],
  ) {
    const { can, build } = new AbilityBuilder<AppAbility>(Ability as any);

    rolePermissions.forEach((rp) => {
      can(rp.accessType as ACCESS_TYPE, 'all');
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<Subjects>,
    });
  }
}
