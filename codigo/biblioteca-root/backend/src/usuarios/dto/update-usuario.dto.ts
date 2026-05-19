import { IsString, IsOptional, IsEmail, IsNumber } from 'class-validator';

export class UpdateUsuarioDto {
  @IsString()
  @IsOptional()
  cedula?: string;

  @IsString()
  @IsOptional()
  codigo_institucional?: string;

  @IsString()
  @IsOptional()
  primer_nombre?: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsOptional()
  primer_apellido?: string;

  @IsString()
  @IsOptional()
  segundo_apellido?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsNumber()
  @IsOptional()
  id_rol?: number;
}