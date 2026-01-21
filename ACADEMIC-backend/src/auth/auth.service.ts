import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity'; 
import * as bcrypt from 'bcrypt'; 
import { JwtService } from '@nestjs/jwt'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
    private readonly jwtService: JwtService 
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const cleanEmail = email.toLowerCase().trim();
    
    const user = await this.userRepository.findOne({ 
      where: { email: cleanEmail },
      select: ['id', 'email', 'password', 'fullName', 'rol'], 
      relations: ['school'] 
    });

    if (user && await bcrypt.compare(pass.trim(), user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null; 
  }

  async login(user: any) {
      const payload = { 
        sub: user.id, 
        email: user.email, 
        rol: user.rol, 
        schoolId: user.school?.id 
      };

      return {
        access_token: this.jwtService.sign(payload), 
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          rol: user.rol 
        }
      };
    }

  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const payload = { sub: user.id, type: 'recovery' };
    
    const token = this.jwtService.sign(payload, { 
      expiresIn: '15m', 
      secret: 'CLAVE_SECRETA_MAESTRA_12345' 
    });

    return { 
      message: 'Correo de recuperación generado', 
      link: `http://localhost:5173/recovery?token=${token}` 
    };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: 'CLAVE_SECRETA_MAESTRA_12345' });
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });
      
      if (!user) throw new NotFoundException('Usuario no encontrado');

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword.trim(), salt);
      await this.userRepository.save(user);

      return { message: 'Contraseña actualizada correctamente.' };
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado.');
    }
  }
}