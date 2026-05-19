import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePrestamoDto {
  @IsNumber()
  @IsNotEmpty()
  id_usuario!: number;

  @IsNumber()
  @IsNotEmpty()
  id_usuario_sistema!: number;

  @IsNumber()
  @IsNotEmpty()
  id_ejemplar!: number;

  // 👇 AQUÍ AGREGAMOS LOS CAMPOS QUE TE DABAN ERROR
  
  @IsString()
  @IsNotEmpty()
  estado!: string;

  @IsDateString()
  @IsNotEmpty()
  fecha_devolucion_esperada!: string;

  @IsDateString()
  @IsOptional() // Este es opcional porque al crear el préstamo aún no lo devuelven
  fecha_devolucion_real?: string;
}