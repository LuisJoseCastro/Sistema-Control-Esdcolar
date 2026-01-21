import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

// DTO para Login
class LoginDto {
  email: string;
  password: string;
}

// DTO para Solicitar Recuperación
class ForgotPasswordDto {
  email: string;
}

// DTO para Cambiar Contraseña
class ResetPasswordDto {
  token: string;
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email, 
      loginDto.password
    );

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    return this.authService.login(user);
  }

  // 👇 1. SOLICITUD: El usuario envía su correo
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  // 👇 2. RESTABLECIMIENTO: El usuario envía el token y la nueva clave
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}