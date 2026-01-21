import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateDocenteDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La clave es obligatoria' })
  @IsString()
  clave: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  especialidad?: string;
}