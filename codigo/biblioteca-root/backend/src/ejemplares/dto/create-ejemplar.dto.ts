import { IsOptional, IsString } from "class-validator";

export class CreateEjemplarDto {
  codigo_barra?: string;
  
  @IsString()
  @IsOptional()
  id_libro! :number;
  //id_libro: number;

  estado?: 'DISPONIBLE' | 'PRESTADO' | 'PERDIDO' | 'DANIADO' | 'MANTENIMIENTO';
  ubicacion_fisica?: string;
  fecha_adquisicion?: string;
}
