import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolesService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateRolDto) {
    if (!dto.max_prestamos || !dto.dias_prestamo) {
      throw new BadRequestException('max_prestamos y dias_prestamo son requeridos');
    }
    const { data, error } = await this.supabase.client
      .from('rol_usuario')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('rol_usuario')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('rol_usuario')
      .select('*')
      .eq('id_rol', id)
      .single();

    if (error) throw new NotFoundException('Rol no encontrado');
    return data;
  }

  async update(id: number, dto: UpdateRolDto) {
    const { data, error } = await this.supabase.client
      .from('rol_usuario')
      .update(dto)
      .eq('id_rol', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('rol_usuario')
      .delete()
      .eq('id_rol', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
