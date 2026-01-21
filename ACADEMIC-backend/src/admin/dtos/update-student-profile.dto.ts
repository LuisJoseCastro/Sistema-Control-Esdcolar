import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional() @IsString() nombre?: string;
  @IsOptional() @IsString() matricula?: string;
  @IsOptional() @IsString() fechaNacimiento?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsEmail()  correo?: string;
  @IsOptional() @IsString() direccion?: string;
  @IsOptional() @IsString() tutor?: string;
  @IsOptional() @IsString() curp?: string;
}