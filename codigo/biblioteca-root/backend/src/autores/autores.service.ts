import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateAutorDto) {
    if (!dto.primer_nombre || !dto.primer_apellido) {
      throw new BadRequestException('El nombre y apellido del autor son requeridos');
    }
    const { data, error } = await this.supabase.client
      .from('autor')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('autor')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('autor')
      .select('*')
      .eq('id_autor', id)
      .single();

    if (error) throw new NotFoundException('Autor no encontrado');
    return data;
  }

  async update(id: number, dto: UpdateAutorDto) {
    const { data, error } = await this.supabase.client
      .from('autor')
      .update(dto)
      .eq('id_autor', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('autor')
      .delete()
      .eq('id_autor', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
