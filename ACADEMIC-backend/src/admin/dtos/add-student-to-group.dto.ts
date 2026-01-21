import { IsString, IsNotEmpty } from 'class-validator';

export class AddStudentDto {
  @IsNotEmpty()
  @IsString()
  matricula: string;

  @IsNotEmpty()
  @IsString()
  nombre: string; 

  @IsNotEmpty()
  @IsString()
  grupoId: string;
}