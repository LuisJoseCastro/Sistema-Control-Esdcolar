import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { RegisterTenantDto } from './dtos/register-tenant.dto';
import { AuthGuard } from '@nestjs/passport'; 
import { RolesGuard } from '../auth/roles.guard'; 
import { Roles } from '../auth/roles.decorator'; 
import { UserRole } from '../shared/enums/user-role.enum'; 

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('default-school')
  getDefaultSchool() {
    return {
      id: 'default-id', 
      nombreEscuela: 'Academy+',
      slug: 'default-school',
      config: {
        colorPrimario: '#0D9488',
        logoUrl: '/logo.png'
      }
    };
  }

  @Post('register')
  create(@Body() registerDto: RegisterTenantDto) {
    return this.tenantsService.registerSchool(registerDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return {
      mensaje: '¡Entraste a la zona VIP!',
      datos_del_usuario: req.user
    };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard) 
  @Roles(UserRole.ADMIN) 
  @Get('ganancias')
  verGanancias(@Request() req) {
    return {
      mensaje: `Hola Director (Rol: ${req.user.rol})`,
      saldo_disponible: 1000000,
      moneda: 'MXN'
    };
  }

  @Post(':id/cancel')
  cancelSubscription(@Param('id') id: string) {
    return this.tenantsService.cancelTenantSubscription(id);
  }
}