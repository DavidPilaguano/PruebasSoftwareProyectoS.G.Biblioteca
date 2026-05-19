import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class CreateUsuarioDto {
  @IsString() @IsNotEmpty()
  cedula!: string;

  @IsString() @IsNotEmpty()
  codigo_institucional!: string;

  @IsString() @IsNotEmpty()
  primer_nombre!: string;

  @IsString() @IsOptional()
  segundo_nombre?: string;

  @IsString() @IsNotEmpty()
  primer_apellido!: string;

  @IsString() @IsOptional()
  segundo_apellido?: string;

  @IsEmail() @IsNotEmpty()
  correo!: string;

  @IsString() @IsOptional()
  telefono?: string;

  @IsString() @IsOptional()
  estado?: string;

  @IsNumber() @IsNotEmpty()
  id_rol!: number;
}