import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrestamosModule } from './prestamos/prestamos.module';
import { SupabaseModule } from './supabase/supabase.module';
import { LibrosModule } from './libros/libros.module';
import { EjemplaresModule } from './ejemplares/ejemplares.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { UsuariosSistemaModule } from './usuarios-sistema/usuarios-sistema.module';
import { AuditoriaModule } from './auditoria/auditoria.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    PrestamosModule,
    LibrosModule,
    EjemplaresModule,
    UsuariosModule,
    RolesModule,
    UsuariosSistemaModule,
    AuditoriaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
