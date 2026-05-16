import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateLibroDto) {
    if (!dto.id_categoria || !dto.id_editorial) {
      throw new BadRequestException('id_categoria e id_editorial son requeridos');
    }
    const { data, error } = await this.supabase.client
      .from('libro')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('libro')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('libro')
      .select('*')
      .eq('id_libro', id)
      .single();

    if (error) throw new NotFoundException('Libro no encontrado');
    return data;
  }

  async update(id: number, dto: UpdateLibroDto) {
    const { data, error } = await this.supabase.client
      .from('libro')
      .update(dto)
      .eq('id_libro', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('libro')
      .delete()
      .eq('id_libro', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
