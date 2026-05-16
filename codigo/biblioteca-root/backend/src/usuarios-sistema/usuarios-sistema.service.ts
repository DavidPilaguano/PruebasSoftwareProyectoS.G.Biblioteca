import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUsuarioSistemaDto } from './dto/create-usuario-sistema.dto';
import { UpdateUsuarioSistemaDto } from './dto/update-usuario-sistema.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsuariosSistemaService {
  constructor(private supabase: SupabaseService) {}

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  async create(dto: CreateUsuarioSistemaDto) {
    if (!dto.rol_sistema || !['ADMINISTRADOR', 'BIBLIOTECARIO'].includes(dto.rol_sistema)) {
      throw new BadRequestException('rol_sistema debe ser ADMINISTRADOR o BIBLIOTECARIO');
    }
    const { password, ...dtoWithoutPassword } = dto;
    const dataToInsert = {
      ...dtoWithoutPassword,
      password_hash: this.hashPassword(password),
      estado: dto.estado || 'ACTIVO',
    };
    
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .insert([dataToInsert])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return { ...data, password_hash: undefined };
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return (data || []).map(u => ({ ...u, password_hash: undefined }));
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .select('*')
      .eq('id_usuario_sistema', id)
      .single();

    if (error) throw new NotFoundException('Usuario de sistema no encontrado');
    return { ...data, password_hash: undefined };
  }

  async update(id: number, dto: UpdateUsuarioSistemaDto) {
    const { password, ...dtoWithoutPassword } = dto;
    const updateData: Record<string, any> = { ...dtoWithoutPassword };
    if (password) {
      updateData.password_hash = this.hashPassword(password);
    }
    
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .update(updateData)
      .eq('id_usuario_sistema', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return { ...data, password_hash: undefined };
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .delete()
      .eq('id_usuario_sistema', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}
