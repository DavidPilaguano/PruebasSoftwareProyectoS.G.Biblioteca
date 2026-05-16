import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { UpdateAuditoriaDto } from './dto/update-auditoria.dto';

@Injectable()
export class AuditoriaService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateAuditoriaDto) {
    if (!dto.tabla_afectada || !dto.id_registro || !dto.accion) {
      throw new BadRequestException('tabla_afectada, id_registro y accion son requeridos');
    }
    const { data, error } = await this.supabase.client
      .from('auditoria')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('auditoria')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data || [];
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('auditoria')
      .select('*')
      .eq('id_auditoria', id)
      .single();

    if (error) throw new NotFoundException('Registro de auditoria no encontrado');
    return data;
  }

  async update(id: number, dto: UpdateAuditoriaDto) {
    const { data, error } = await this.supabase.client
      .from('auditoria')
      .update(dto)
      .eq('id_auditoria', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('auditoria')
      .delete()
      .eq('id_auditoria', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
