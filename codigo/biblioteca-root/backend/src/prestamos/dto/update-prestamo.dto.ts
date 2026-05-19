import { PartialType } from '@nestjs/mapped-types';
import { CreatePrestamoDto } from './create-prestamo.dto'; // Asegúrate de que la ruta sea la correcta
import { IsOptional, IsDateString } from 'class-validator';

// PartialType hace que TODOS los campos de CreatePrestamoDto sean opcionales automáticamente
export class UpdatePrestamoDto extends PartialType(CreatePrestamoDto) {
  
  // Si necesitas añadir validaciones extra específicas para la actualización:
  
  @IsDateString()
  @IsOptional()
  fecha_devolucion_real?: string; 
  estado_prestamo?: string;
  // Al actualizar, este campo suele ser el más importante porque registra el día exacto que devuelven el libro
}