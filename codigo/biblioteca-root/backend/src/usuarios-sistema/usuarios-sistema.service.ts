import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUsuarioSistemaDto } from './dto/create-usuario-sistema.dto';
import { UpdateUsuarioSistemaDto } from './dto/update-usuario-sistema.dto';
import * as crypto from 'crypto';

@Injectable()
export class UsuariosSistemaService {
  constructor(private supabase: SupabaseService) {}

  /**
   * Genera un hash SHA-256 para proteger la contraseña
   */
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * Crea un nuevo usuario administrativo en el sistema
   */
  async create(dto: CreateUsuarioSistemaDto) {
    if (!dto.rol_sistema || !['ADMINISTRADOR', 'BIBLIOTECARIO'].includes(dto.rol_sistema)) {
      throw new BadRequestException('rol_sistema debe ser ADMINISTRADOR o BIBLIOTECARIO');
    }
    
    // Si por error el frontend manda 'password_hash' en lugar de 'password', lo manejamos
    const passwordRaw = dto.password || (dto as any).password_hash;
    if (!passwordRaw) {
      throw new BadRequestException('La contraseña es obligatoria para la creación');
    }

    const { password, ...dtoWithoutPassword } = dto;
    
    // Eliminamos cualquier rastro de password_hash que venga del body para meter el real
    delete (dtoWithoutPassword as any).password_hash;

    const dataToInsert = {
      ...dtoWithoutPassword,
      password_hash: this.hashPassword(passwordRaw),
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

  /**
   * Obtiene todos los usuarios del sistema (oculta el hash de contraseña)
   */
  async findAll() {
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .select('*');

    if (error) throw new BadRequestException(error.message);
    return (data || []).map(u => ({ ...u, password_hash: undefined }));
  }

  /**
   * Busca un usuario del sistema por su ID primario
   */
  async findOne(id: number) {
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .select('*')
      .eq('id_usuario_sistema', id)
      .single();

    if (error) throw new NotFoundException('Usuario de sistema no encontrado');
    return { ...data, password_hash: undefined };
  }

  /**
   * Actualiza un usuario del sistema depurando campos vacíos e inmutables del frontend
   */
  async update(id: number, dto: UpdateUsuarioSistemaDto) {
    const { password, ...dtoWithoutPassword } = dto;
    const updateData: Record<string, any> = {};

    // 1. Filtramos strings vacíos para evitar colisiones con restricciones NOT NULL
    Object.keys(dtoWithoutPassword).forEach((key) => {
      const value = dtoWithoutPassword[key as keyof typeof dtoWithoutPassword];
      if (value !== undefined && value !== null && value !== '') {
        updateData[key] = value;
      }
    });

    // 🚨 2. ELIMINAR ÚNICAMENTE LOS CAMPOS INMUTABLES REALES
    // El 'username' no debe cambiar nunca. La contraseña se procesa aparte.
    // Quitamos 'password_hash' por si Next.js lo coló en el envío.
    delete updateData.username;
    delete updateData.password;
    delete updateData.password_hash;

    // 3. Hasheamos la nueva contraseña únicamente si el usuario la escribió
    if (password && password.trim() !== '') {
      updateData.password_hash = this.hashPassword(password);
    }

    // Log de control para ver el paquete real que viaja a Supabase
    console.log('Payload limpio enviado a Supabase:', updateData);

    // Si no hay datos reales que cambiar tras la limpieza, retornamos el estado actual sin consultar
    if (Object.keys(updateData).length === 0) {
      return this.findOne(id);
    }

    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .update(updateData)
      .eq('id_usuario_sistema', id)
      .select('*')
      .single();

    if (error) {
      console.error('🔴 Error detallado de Supabase:', error.message);
      throw new BadRequestException({
        statusCode: 400,
        message: 'ERROR REAL DE SUPABASE',
        error_db: error.message
      });
    }

    return { ...data, password_hash: undefined };
  }

  /**
   * Elimina un usuario del sistema por ID
   */
  async remove(id: number) {
    const { data, error } = await this.supabase.client
      .from('usuario_sistema')
      .delete()
      .eq('id_usuario_sistema', id);

    if (error) throw new BadRequestException(error.message);
    return { deleted: true };
  }
}