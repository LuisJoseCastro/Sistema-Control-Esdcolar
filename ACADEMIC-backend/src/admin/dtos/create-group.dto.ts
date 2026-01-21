import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CreateGroupDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  nombre: string; 

  @IsOptional() // 
  @IsNumber()
  limiteAlumnos?: number; 

  @IsOptional()
  @IsNumber()
  semestre?: number; 

  @IsOptional()
  @IsString()
  turno?: string;
}