export class CreateUsuarioSistemaDto {
  username: string;
  password: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  estado?: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
  rol_sistema: 'ADMINISTRADOR' | 'BIBLIOTECARIO';
}
