import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrestamosModule } from './prestamos/prestamos.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SupabaseModule, PrestamosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
