import { Module } from '@nestjs/common';
import { UsuariosSistemaService } from './usuarios-sistema.service';
import { UsuariosSistemaController } from './usuarios-sistema.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [UsuariosSistemaController],
  providers: [UsuariosSistemaService],
})
export class UsuariosSistemaModule {}
