import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty()
  @IsString()
  materia: string; 

  @IsNotEmpty()
  @IsString()
  codigo: string; 

  @IsOptional()
  @IsNumber()
  creditos?: number; 
}