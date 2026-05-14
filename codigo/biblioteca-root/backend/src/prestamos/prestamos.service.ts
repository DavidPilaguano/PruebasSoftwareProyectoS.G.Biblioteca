import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';

@Injectable()
export class PrestamosService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreatePrestamoDto) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .insert([dto])
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .select('*')
      .eq('id_prestamo', id)
      .single();

    if (error) throw new NotFoundException(error.message);
    return data;
  }

  async update(id: number, dto: UpdatePrestamoDto) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .update(dto)
      .eq('id_prestamo', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('prestamo')
      .delete()
      .eq('id_prestamo', id)
      .select('*')
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }
}