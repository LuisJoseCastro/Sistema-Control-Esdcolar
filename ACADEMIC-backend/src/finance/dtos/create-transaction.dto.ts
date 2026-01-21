import { IsString, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransactionCatalogDto {
  @IsUUID()
  schoolId: string;

  @IsString()
  @IsNotEmpty()
  nombreTramite: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costo: number;
}