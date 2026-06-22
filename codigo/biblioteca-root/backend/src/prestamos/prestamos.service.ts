import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';

@Injectable()
export class PrestamosService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreatePrestamoDto) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client.from('prestamo').select(`
        id_prestamo,
        id_usuario,                 
        id_usuario_sistema,         
        id_ejemplar,                
        fecha_prestamo,
        fecha_devolucion_esperada,  
        fecha_devolucion_real,      
        estado,
        usuario (
          primer_nombre,
          primer_apellido,
          cedula
        ),
        ejemplar (
          codigo_barra,
          libro (
            titulo
          )
        )
      `);

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .select(
        `
        *,
        usuario (
          primer_nombre,
          primer_apellido,
          cedula
        ),
        ejemplar (
          codigo_barra,
          libro (
            titulo
          )
        )
      `,
      )
      .eq('id_prestamo', id)
      .single();

    if (error || !data)
      throw new NotFoundException(error?.message || 'Préstamo no encontrado');
    return data;
  }

  async update(id: number, dto: UpdatePrestamoDto) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .update(dto)
      .eq('id_prestamo', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .delete()
      .eq('id_prestamo', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}
