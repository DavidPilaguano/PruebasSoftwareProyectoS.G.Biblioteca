import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateEditorialDto } from './dto/create-editorial.dto';
import { UpdateEditorialDto } from './dto/update-editorial.dto';

@Injectable()
export class EditorialesService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateEditorialDto) {
    if (!dto.nombre) {
      throw new BadRequestException('El nombre de la editorial es requerido');
    }
    const { data, error } = await this.supabase.client
      .from('editorial')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('editorial')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('editorial')
      .select('*')
      .eq('id_editorial', id)
      .single();

    if (error) throw new NotFoundException('Editorial no encontrada');
    return data;
  }

  async update(id: number, dto: UpdateEditorialDto) {
    const { data, error } = await this.supabase.client
      .from('editorial')
      .update(dto)
      .eq('id_editorial', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('editorial')
      .delete()
      .eq('id_editorial', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
