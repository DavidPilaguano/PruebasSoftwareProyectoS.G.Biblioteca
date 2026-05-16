import { Module } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { AutoresController } from './autores.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [AutoresController],
  providers: [AutoresService],
})
export class AutoresModule {}
