import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'CLAVE_SECRETA_MAESTRA_12345', 
    });
  }

  async validate(payload: any) {
    if (!payload) {
        throw new UnauthorizedException('Token inválido o vacío');
    }
    
    return { 
      userId: payload.sub, 
      email: payload.email, 
      rol: payload.rol ? payload.rol.toUpperCase() : 'USER', 
      schoolId: payload.schoolId 
    };
  }
}