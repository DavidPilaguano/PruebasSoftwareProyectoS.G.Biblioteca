import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateUsuarioSistemaDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  password_hash?: string; // 👈 Lo agregamos aquí para que NestJS no lo rebote si el frontend lo manda

  @IsString()
  @IsNotEmpty()
  primer_nombre!: string;

  @IsString()
  @IsOptional()
  segundo_nombre?: string;

  @IsString()
  @IsNotEmpty()
  primer_apellido!: string;

  @IsString()
  @IsOptional()
  segundo_apellido?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsNotEmpty()
  rol_sistema!: string;
}
