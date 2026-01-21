import { IsString, IsEmail, IsEnum, IsUUID, MinLength } from 'class-validator';
import { UserRole } from '../../shared/enums/user-role.enum';

export class CreateUserDto {
  @IsUUID()
  schoolId: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  fullName: string;

  @IsEnum(UserRole)
  rol: UserRole;
}