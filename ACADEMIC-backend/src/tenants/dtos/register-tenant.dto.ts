import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, MinLength } from 'class-validator';

export enum PlanType {
  BASIC = 'BASIC',
  PRO = 'PRO',
}

export class RegisterTenantDto {
  @IsNotEmpty()
  @IsString()
  nombreEscuela: string;

  @IsNotEmpty()
  @IsString()
  dominioEscuela: string;

  @IsEmail()
  @IsNotEmpty()
  emailAdmin: string;

  @IsOptional() 
  nombreAdmin?: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  passwordAdmin: string;

  @IsNotEmpty()
  @IsEnum(PlanType)
  plan: PlanType; 

  @IsOptional()
  @IsString()
  tokenPago?: string;

  @IsOptional()
  @IsString()
  tarjetaUltimos4?: string;
  
  @IsOptional()
  @IsString()
  nombreTitular?: string;
}