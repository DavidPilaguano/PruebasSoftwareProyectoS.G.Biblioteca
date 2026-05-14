// Tipos base que reflejan las tablas
export type UserStatus = 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO' | 'BLOQUEADO';
export type LoanStatus = 'ACTIVO' | 'DEVUELTO' | 'ATRASADO' | 'CANCELADO';
export type ItemStatus = 'DISPONIBLE' | 'PRESTADO' | 'PERDIDO' | 'DANIADO' | 'MANTENIMIENTO';

export interface Libro {
  id_libro: number;
  isbn: string;
  titulo: string;
  anio_publicacion: number;
  descripcion: string;
  // Campos join (relacionales)
  categoria?: { nombre: string };
  editorial?: { nombre: string };
}

export interface Usuario {
  id_usuario: number;
  codigo_institucional: string;
  primer_nombre: string;
  primer_apellido: string;
  correo: string;
  estado: UserStatus;
}

export interface Prestamo {
  id_prestamo: number;
  id_usuario: number;
  id_ejemplar: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada: string;
  estado: LoanStatus;
  // Relaciones cargadas
  libro?: { titulo: string }; 
  usuario?: { primer_nombre: string; primer_apellido: string };
}