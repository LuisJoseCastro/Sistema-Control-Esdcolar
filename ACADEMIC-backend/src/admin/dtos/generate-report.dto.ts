import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class GenerateReportDto {
  @IsNotEmpty()
  @IsString()
  periodo: string; 

  @IsNotEmpty()
  @IsString()
  asignatura: string; 

  @IsNotEmpty()
  @IsString()
  grupo: string; 

  @IsOptional()
  @IsString()
  matricula?: string; 
}