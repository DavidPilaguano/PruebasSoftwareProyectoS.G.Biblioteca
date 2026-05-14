// backend/src/common/entities/biblioteca.entity.ts

export class UsuarioEntity {
  id_usuario: number;
  cedula: string;
  codigo_institucional: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo: string;
  telefono?: string;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO' | 'BLOQUEADO';
  id_rol: number;
}

export class LibroEntity {
  id_libro: number;
  isbn: string;
  titulo: string;
  anio_publicacion?: number;
  descripcion?: string;
  id_categoria: number;
  id_editorial: number;
}

export class PrestamoEntity {
  id_prestamo: number;
  id_usuario: number;
  id_usuario_sistema: number;
  id_ejemplar: number;
  fecha_prestamo: Date;
  fecha_devolucion_esperada?: Date;
  fecha_devolucion_real?: Date;
  estado: 'ACTIVO' | 'DEVUELTO' | 'ATRASADO' | 'CANCELADO';
}