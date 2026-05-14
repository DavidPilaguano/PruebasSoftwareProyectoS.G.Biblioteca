import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePrestamoDto {
  @IsNumber() @IsNotEmpty()
  id_usuario: number;

  @IsNumber() @IsNotEmpty()
  id_usuario_sistema: number;

  @IsNumber() @IsNotEmpty()
  id_ejemplar: number;
}