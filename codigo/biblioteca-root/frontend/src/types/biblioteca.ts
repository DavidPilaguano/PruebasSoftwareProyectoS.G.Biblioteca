export interface Libro {
  id_libro: number;
  isbn: string;
  titulo: string;
  anio_publicacion: number;
  descripcion: string;
  id_categoria: number;
  id_editorial: number;
  categoria?: Categoria;
  editorial?: Editorial;
  autores?: Autor[];
}

export interface CreateLibroDto {
  isbn: string;
  titulo: string;
  anio_publicacion: number;
  descripcion: string;
  id_categoria: number;
  id_editorial: number;
  autores?: number[];
}

export interface UpdateLibroDto {
  isbn?: string;
  titulo?: string;
  anio_publicacion?: number;
  descripcion?: string;
  id_categoria?: number;
  id_editorial?: number;
  autores?: number[];
}

export interface Autor {
  id_autor: number;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nacionalidad?: string;
}

export interface CreateAutorDto {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  nacionalidad?: string;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
}

export interface CreateCategoriaDto {
  nombre: string;
  descripcion?: string;
}

export interface Editorial {
  id_editorial: number;
  nombre: string;
  pais?: string;
}

export interface CreateEditorialDto {
  nombre: string;
  pais?: string;
}

export interface Ejemplar {
  id_ejemplar: number;
  codigo_barra?: string;
  id_libro: number;
  estado: 'DISPONIBLE' | 'PRESTADO' | 'PERDIDO' | 'DANIADO' | 'MANTENIMIENTO';
  ubicacion_fisica?: string;
  fecha_adquisicion?: string;
  libro?: Libro;
}

export interface CreateEjemplarDto {
  codigo_barra?: string;
  id_libro: number;
  estado?: 'DISPONIBLE';
  ubicacion_fisica?: string;
  fecha_adquisicion?: string;
}

export interface UpdateEjemplarDto {
  estado?: 'DISPONIBLE' | 'PRESTADO' | 'PERDIDO' | 'DANIADO' | 'MANTENIMIENTO';
  ubicacion_fisica?: string;
}

export interface Usuario {
  id_usuario: number;
  cedula?: string;
  codigo_institucional: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo: string;
  telefono?: string;
  estado: 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO' | 'BLOQUEADO';
  id_rol: number;
  rol?: RolUsuario;
}

export interface CreateUsuarioDto {
  cedula?: string;
  codigo_institucional: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  correo: string;
  telefono?: string;
  estado?: 'ACTIVO';
  id_rol: number;
}

export interface UpdateUsuarioDto {
  cedula?: string;
  codigo_institucional?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  correo?: string;
  telefono?: string;
  estado?: 'ACTIVO' | 'SUSPENDIDO' | 'INACTIVO' | 'BLOQUEADO';
  id_rol?: number;
}

export interface RolUsuario {
  id_rol: number;
  nombre: string;
  max_prestamos: number;
  dias_prestamo: number;
}

export interface CreateRolUsuarioDto {
  nombre: string;
  max_prestamos: number;
  dias_prestamo: number;
}

export interface UpdateRolUsuarioDto {
  nombre?: string;
  max_prestamos?: number;
  dias_prestamo?: number;
}

export interface Prestamo {
  id_prestamo: number;
  id_usuario: number;
  id_usuario_sistema: number;
  id_ejemplar: number;
  fecha_prestamo: string;
  fecha_devolucion_esperada?: string;
  fecha_devolucion_real?: string;
  estado: 'ACTIVO' | 'DEVUELTO' | 'ATRASADO' | 'CANCELADO';
  usuario?: Usuario;
  usuario_sistema?: UsuarioSistema;
  ejemplar?: Ejemplar;
}

export interface CreatePrestamoDto {
  id_usuario: number;
  id_usuario_sistema: number;
  id_ejemplar: number;
  fecha_devolucion_esperada?: string;
}

export interface UpdatePrestamoDto {
  estado?: 'ACTIVO' | 'DEVUELTO' | 'ATRASADO' | 'CANCELADO';
  fecha_devolucion_real?: string;
  fecha_devolucion_esperada?: string;
}

export interface UsuarioSistema {
  id_usuario_sistema: number;
  username: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
  rol_sistema: 'ADMINISTRADOR' | 'BIBLIOTECARIO';
}

export interface CreateUsuarioSistemaDto {
  username: string;
  password_hash: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  estado?: 'ACTIVO';
  rol_sistema: 'ADMINISTRADOR' | 'BIBLIOTECARIO';
}

export interface UpdateUsuarioSistemaDto {
  username?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  estado?: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
  rol_sistema?: 'ADMINISTRADOR' | 'BIBLIOTECARIO';
}

export interface Auditoria {
  id_auditoria: number;
  tabla_afectada: string;
  id_registro: number;
  accion: 'INSERT' | 'UPDATE' | 'DELETE';
  usuario_sistema: string;
  fecha_evento: string;
  valor_anterior?: string;
  valor_nuevo?: string;
}

export interface Reserva {
  id_reserva: number;
  id_usuario: number;
  id_usuario_sistema: number;
  id_libro: number;
  fecha_reserva: string;
  fecha_expiracion: string;
  estado: 'ACTIVA' | 'EXPIRADA' | 'COMPLETADA' | 'CANCELADA';
  usuario?: Usuario;
  libro?: Libro;
}

export interface Sancion {
  id_sancion: number;
  id_usuario: number;
  id_usuario_sistema: number;
  id_prestamo: number;
  tipo: string;
  monto: number;
  motivo?: string;
  estado: 'PENDIENTE' | 'PAGADA' | 'ACTIVA' | 'CONDONADA';
  fecha_inicio: string;
  fecha_fin?: string;
}