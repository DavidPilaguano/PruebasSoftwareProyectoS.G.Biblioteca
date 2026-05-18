import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
    private supabase: SupabaseService,
    private jwtService: JwtService,
    ) {}

    async login(username: string, password_plain: string) {
    const { data: usuario, error } = await this.supabase.client
        .from('usuario_sistema')
        .select('*')
        .eq('username', username)
        .eq('estado', 'ACTIVO')
        .single();

    if (error || !usuario) {
        throw new UnauthorizedException('Credenciales incorrectas o usuario inactivo');
    }

    // Comparamos la contraseña en texto plano con el hash de la Base de Datos
    // NOTA: Si metiste contraseñas en texto plano para probar, cambia esto por: if (password_plain !== usuario.password_hash)
    const isPasswordValid = await bcrypt.compare(password_plain, usuario.password_hash).catch(() => false) || password_plain === usuario.password_hash;

    if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Creamos el Payload del JWT con los roles y datos necesarios
    const payload = { 
        sub: usuario.id_usuario_sistema, 
        username: usuario.username, 
        rol: usuario.rol_sistema,
        nombre: `${usuario.primer_nombre} ${usuario.primer_apellido}`
    };

    return {
        access_token: this.jwtService.sign(payload),
        user: {
        id: usuario.id_usuario_sistema,
        username: usuario.username,
        rol_sistema: usuario.rol_sistema,
        nombre: payload.nombre
        }
    };
    }
}