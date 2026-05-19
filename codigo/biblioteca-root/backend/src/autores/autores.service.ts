import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateAutorDto) {
    if (!dto.primer_nombre || !dto.primer_apellido) {
      throw new BadRequestException(
        'El nombre y apellido del autor son requeridos',
      );
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

  // Archivo: src/autores/autores.service.ts

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('autor')
      .select('*')
      .eq('id_autor', id)
      .single();

    if (!data) throw new NotFoundException('Autor no encontrado');
    if (error) {
      throw new BadRequestException(error.message);
    }

    return data;
  }

  async update(id: number, updateDto: any) {
    const { data, error } = await this.supabase.client
      .from('autor')
      .update(updateDto)
      .eq('id_autor', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException('Autor no encontrado');

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
