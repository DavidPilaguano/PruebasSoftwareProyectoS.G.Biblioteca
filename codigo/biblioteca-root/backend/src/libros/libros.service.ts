import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(private supabase: SupabaseService) {}

  async getDashboardStats() {
    try {
      const client = this.supabase.client;

      // Usamos los nombres exactos de tus tablas de Postgres de Supabase
      const [librosRes, usuariosRes, ejemplaresRes] = await Promise.all([
        client.from('libro').select('*', { count: 'exact', head: true }),
        client.from('usuario').select('*', { count: 'exact', head: true }),
        client.from('ejemplar').select('*', { count: 'exact', head: true }),
      ]);

      // Si Supabase devuelve un error en alguna consulta, lo disparamos
      if (librosRes.error) throw librosRes.error;
      if (usuariosRes.error) throw usuariosRes.error;
      if (ejemplaresRes.error) throw ejemplaresRes.error;

      return {
        libros: librosRes.count || 0,
        usuarios: usuariosRes.count || 0,
        ejemplares: ejemplaresRes.count || 0,
      };
    } catch (error) {
      console.log(error)
    }
  }

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
    const { error } = await this.supabase.client
      .from('libro')
      .delete()
      .eq('id_libro', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}