export class Auditoria {
  id_auditoria: number;
  tabla_afectada: string;
  id_registro: number;
  accion: 'INSERT' | 'UPDATE' | 'DELETE';
  usuario_sistema: string;
  fecha_evento?: Date;
  valor_anterior?: string;
  valor_nuevo?: string;
}
