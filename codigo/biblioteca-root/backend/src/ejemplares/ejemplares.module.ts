import { Module } from '@nestjs/common';
import { EjemplaresService } from './ejemplares.service';
import { EjemplaresController } from './ejemplares.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [EjemplaresController],
  providers: [EjemplaresService],
})
export class EjemplaresModule {}
