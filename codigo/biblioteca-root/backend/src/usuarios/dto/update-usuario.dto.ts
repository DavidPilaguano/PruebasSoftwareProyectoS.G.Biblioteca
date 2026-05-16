export class UpdateUsuarioDto {
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
