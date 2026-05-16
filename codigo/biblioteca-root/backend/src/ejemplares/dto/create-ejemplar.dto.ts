export class CreateEjemplarDto {
  codigo_barra?: string;
  id_libro: number;
  estado?: 'DISPONIBLE' | 'PRESTADO' | 'PERDIDO' | 'DANIADO' | 'MANTENIMIENTO';
  ubicacion_fisica?: string;
  fecha_adquisicion?: string;
}
