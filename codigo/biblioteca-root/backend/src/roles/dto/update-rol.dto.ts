import { PartialType } from '@nestjs/mapped-types';
import { CreateRolDto } from './create-rol.dto'; // 👈 Verifica que la ruta al archivo de creación sea la correcta

// ✅ Esto hace que 'nombre', 'max_prestamos' y 'dias_prestamo' sean @IsOptional() automáticamente
export class UpdateRolDto extends PartialType(CreateRolDto) {}