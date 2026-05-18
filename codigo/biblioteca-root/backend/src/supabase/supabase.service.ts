import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as ws from 'ws'; 
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

    this.supabase = createClient(url, key, {
        auth: {
            persistSession: false,
        },
        realtime: {
        transport: ws as any, 
        },
        });
    }

    get client(): SupabaseClient {
        return this.supabase;
    }
}
