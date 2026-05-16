import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateEjemplarDto } from './dto/create-ejemplar.dto';
import { UpdateEjemplarDto } from './dto/update-ejemplar.dto';

@Injectable()
export class EjemplaresService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateEjemplarDto) {
    if (!dto.id_libro) {
      throw new BadRequestException('id_libro es requerido');
    }
    const { data, error } = await this.supabase.client
      .from('ejemplar')
      .insert([{ ...dto, estado: dto.estado || 'DISPONIBLE' }])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('ejemplar')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('ejemplar')
      .select('*')
      .eq('id_ejemplar', id)
      .single();

    if (error) throw new NotFoundException('Ejemplar no encontrado');
    return data;
  }

  async update(id: number, dto: UpdateEjemplarDto) {
    const { data, error } = await this.supabase.client
      .from('ejemplar')
      .update(dto)
      .eq('id_ejemplar', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('ejemplar')
      .delete()
      .eq('id_ejemplar', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
