import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateCategoriaDto) {
    if (!dto.nombre) {
      throw new BadRequestException('El nombre de la categoría es requerido');
    }
    const { data, error } = await this.supabase.client
      .from('categoria')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('categoria')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('categoria')
      .select('*')
      .eq('id_categoria', id)
      .single();

    if (error) throw new NotFoundException('Categoría no encontrada');
    return data;
  }

  async update(id: number, dto: UpdateCategoriaDto) {
    const { data, error } = await this.supabase.client
      .from('categoria')
      .update(dto)
      .eq('id_categoria', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('categoria')
      .delete()
      .eq('id_categoria', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
