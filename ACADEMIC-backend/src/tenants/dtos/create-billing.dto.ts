import { IsString, IsNotEmpty, Length, IsDateString, IsUUID } from 'class-validator';

export class CreateBillingDto {
  @IsUUID()
  schoolId: string; 

  @IsString()
  @IsNotEmpty()
  nombreTitular: string;

  @IsString()
  @Length(4, 4)
  ultimosDigitosTarjeta: string;

  @IsString()
  @IsNotEmpty()
  tokenPago: string;

  @IsDateString()
  fechaVencimiento: string; 

  @IsString()
  direccionFiscal: string;
}