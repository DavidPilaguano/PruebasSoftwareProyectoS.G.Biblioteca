import { IsString, IsOptional } from 'class-validator';

export class UpdateUsuarioSistemaDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  password_hash?: string; // 👈 También mapeado para evitar el "should not exist"

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

  @IsString()
  @IsOptional()
  estado?: string;

  @IsString()
  @IsOptional()
  rol_sistema?: string;
}
