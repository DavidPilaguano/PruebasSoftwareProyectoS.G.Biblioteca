import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePrestamoDto {
  @IsNumber() @IsNotEmpty()@IsString()@IsOptional()

  id_usuario!: number;

  @IsNumber() @IsNotEmpty()
  id_usuario_sistema!: number;

  @IsNumber() @IsNotEmpty()
  id_ejemplar!: number;
}