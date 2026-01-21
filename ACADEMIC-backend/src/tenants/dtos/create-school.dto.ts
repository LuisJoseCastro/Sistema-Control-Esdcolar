import { IsString, IsEmail, IsNotEmpty, IsUrl, IsEnum, IsOptional } from 'class-validator';
import { PlanSuscripcion } from '../../shared/enums/subscription-plan.enum';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la escuela es obligatorio' })
  nombreEscuela: string;

  @IsString()
  @IsNotEmpty()
  dominioEscuela: string;

  @IsEmail({}, { message: 'El correo de contacto debe ser válido' })
  correoContacto: string;

  @IsUrl({}, { message: 'El logo debe ser una URL válida' })
  @IsOptional()
  logoUrl?: string;

  @IsEnum(PlanSuscripcion)
  @IsOptional()
  planSuscripcion?: PlanSuscripcion;
}