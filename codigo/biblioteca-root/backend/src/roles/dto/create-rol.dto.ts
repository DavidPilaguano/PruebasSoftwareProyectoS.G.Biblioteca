import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateRolDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  nombre!: string;

  @IsNumber({}, { message: 'max_prestamos debe ser un número válido' })
  @Min(1, { message: 'El máximo de préstamos debe ser al menos 1' })
  max_prestamos!: number;

  @IsNumber({}, { message: 'dias_prestamo debe ser un número válido' })
  @Min(1, { message: 'Los días de préstamo deben ser al menos 1' })
  dias_prestamo!: number;
}