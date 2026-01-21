import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../shared/enums/user-role.enum'; 

export class RolesKey {
  static readonly KEY = 'roles';
}

export const Roles = (...roles: UserRole[]) => SetMetadata(RolesKey.KEY, roles);