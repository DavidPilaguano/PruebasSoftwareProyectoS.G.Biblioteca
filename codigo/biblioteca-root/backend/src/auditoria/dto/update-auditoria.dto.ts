export class UpdateAuditoriaDto {
  tabla_afectada?: string;
  id_registro?: number;
  accion?: 'INSERT' | 'UPDATE' | 'DELETE';
  usuario_sistema?: string;
  valor_anterior?: string;
  valor_nuevo?: string;
}
