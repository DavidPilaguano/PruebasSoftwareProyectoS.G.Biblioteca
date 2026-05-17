import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as ws from 'ws'; // Importamos el paquete para solucionar el soporte de WebSockets en Node 20

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
      throw new InternalServerErrorException(
        'Las credenciales de Supabase no están configuradas en el archivo .env',
      );
    }

    // Inicializamos el cliente con la configuración compatible para Node.js 20
    this.supabase = createClient(url, key, {
      auth: {
        persistSession: false,
      },
      realtime: {
        transport: ws as any, // "as any" evita el conflicto de tipos estricto de TS
      },
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }
}