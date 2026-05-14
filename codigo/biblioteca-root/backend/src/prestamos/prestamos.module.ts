import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { PrestamosService } from './prestamos.service';
import { PrestamosController } from './prestamos.controller';

@Module({
  imports: [SupabaseModule],
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamosModule {}
