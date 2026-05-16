import { Module } from '@nestjs/common';
import { EditorialesService } from './editoriales.service';
import { EditorialesController } from './editoriales.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [EditorialesController],
  providers: [EditorialesService],
})
export class EditorialesModule {}
