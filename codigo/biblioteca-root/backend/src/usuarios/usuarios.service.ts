import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateUsuarioDto) {
    if (!dto.id_rol) {
      throw new BadRequestException('id_rol es requerido');
    }
    const { data, error } = await this.supabase.client
      .from('usuario')
      .insert([{ ...dto, estado: dto.estado || 'ACTIVO' }])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .select('*')
      .eq('id_usuario', id)
      .single();

    if (error) throw new NotFoundException('Usuario no encontrado');
    return data;
  }

  async update(id: number, dto: UpdateUsuarioDto) {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .update(dto)
      .eq('id_usuario', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('usuario')
      .delete()
      .eq('id_usuario', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
