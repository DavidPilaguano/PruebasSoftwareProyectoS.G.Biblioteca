import { IsOptional, IsString } from "class-validator";

export class Prestamo {
  @IsString()
  @IsOptional()
  id_prestamo!: number;
    @IsString()
  @IsOptional()
  id_usuario!: number;
    @IsString()
  @IsOptional()
  id_usuario_sistema!: number;
    @IsString()
  @IsOptional()
  id_ejemplar!: number;
  fecha_prestamo?: string;
  fecha_devolucion_esperada?: string;
  estado?: string;
}

