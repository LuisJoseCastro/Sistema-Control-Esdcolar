import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesKey } from './roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} 

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(RolesKey.KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.rol) {
        throw new UnauthorizedException('Usuario no identificado o rol no encontrado en el token.');
    }

    const tienePermiso = requiredRoles.some((role) => 
        user.rol.toUpperCase() === role.toString().toUpperCase()
    );

    if (!tienePermiso) {
      console.log(`⛔ Bloqueo de Rol: Usuario tiene [${user.rol}] pero se requiere [${requiredRoles}]`);
      throw new ForbiddenException('⛔ No tienes permisos para estar aquí (Role insuficiente)');
    }

    return true;
  }
}