import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateLibroDto {
  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsNotEmpty({ message: 'El título del libro es obligatorio' })
  titulo!: string; // 💡 Añadido '!'

  @IsNumber()
  @IsOptional()
  @Min(1400, { message: 'El año de publicación debe ser mayor o igual a 1400' })
  anio_publicacion?: number;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Debe especificar una categoría válida' })
  id_categoria!: number; // 💡 Añadido '!'

  @IsNumber()
  @IsNotEmpty({ message: 'Debe especificar una editorial válida' })
  id_editorial!: number; // 💡 Añadido '!'
}