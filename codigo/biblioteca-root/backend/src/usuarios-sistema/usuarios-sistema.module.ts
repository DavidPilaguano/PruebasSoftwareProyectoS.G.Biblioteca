import { Module } from '@nestjs/common';
import { UsuariosSistemaService } from './usuarios-sistema.service';
import { UsuariosSistemaController, AuthController } from './usuarios-sistema.controller';
import { AuthService } from './auth.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    SupabaseModule,
    JwtModule.register({
      // Usa la variable de entorno o un fallback por si acaso en desarrollo
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' }, // El token durará 24 horas activo
    }),
  ],
  controllers: [UsuariosSistemaController, AuthController], // Declaramos ambos controladores aquí
  providers: [UsuariosSistemaService, AuthService],        // Declaramos ambos servicios aquí
})
export class UsuariosSistemaModule {}