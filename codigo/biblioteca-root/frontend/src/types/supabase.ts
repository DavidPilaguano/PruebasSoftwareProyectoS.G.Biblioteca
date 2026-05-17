export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      auditoria: {
        Row: {
          accion: string
          fecha_evento: string
          id_auditoria: number
          id_registro: number
          tabla_afectada: string
          usuario_sistema: string
          valor_anterior: string | null
          valor_nuevo: string | null
        }
        Insert: {
          accion: string
          fecha_evento?: string
          id_auditoria?: never
          id_registro: number
          tabla_afectada: string
          usuario_sistema: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Update: {
          accion?: string
          fecha_evento?: string
          id_auditoria?: never
          id_registro?: number
          tabla_afectada?: string
          usuario_sistema?: string
          valor_anterior?: string | null
          valor_nuevo?: string | null
        }
        Relationships: []
      }
      autor: {
        Row: {
          id_autor: number
          nacionalidad: string | null
          primer_apellido: string
          primer_nombre: string
          segundo_apellido: string | null
          segundo_nombre: string | null
        }
        Insert: {
          id_autor?: never
          nacionalidad?: string | null
          primer_apellido: string
          primer_nombre: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
        }
        Update: {
          id_autor?: never
          nacionalidad?: string | null
          primer_apellido?: string
          primer_nombre?: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
        }
        Relationships: []
      }
      categoria: {
        Row: {
          descripcion: string | null
          id_categoria: number
          nombre: string
        }
        Insert: {
          descripcion?: string | null
          id_categoria?: never
          nombre: string
        }
        Update: {
          descripcion?: string | null
          id_categoria?: never
          nombre?: string
        }
        Relationships: []
      }
      editorial: {
        Row: {
          id_editorial: number
          nombre: string
          pais: string | null
        }
        Insert: {
          id_editorial?: never
          nombre: string
          pais?: string | null
        }
        Update: {
          id_editorial?: never
          nombre?: string
          pais?: string | null
        }
        Relationships: []
      }
      ejemplar: {
        Row: {
          codigo_barra: string | null
          estado: string
          fecha_adquisicion: string | null
          id_ejemplar: number
          id_libro: number
          ubicacion_fisica: string | null
        }
        Insert: {
          codigo_barra?: string | null
          estado?: string
          fecha_adquisicion?: string | null
          id_ejemplar?: never
          id_libro: number
          ubicacion_fisica?: string | null
        }
        Update: {
          codigo_barra?: string | null
          estado?: string
          fecha_adquisicion?: string | null
          id_ejemplar?: never
          id_libro?: number
          ubicacion_fisica?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ejemplar_id_libro_fkey"
            columns: ["id_libro"]
            isOneToOne: false
            referencedRelation: "libro"
            referencedColumns: ["id_libro"]
          },
        ]
      }
      libro: {
        Row: {
          anio_publicacion: number | null
          descripcion: string | null
          id_categoria: number
          id_editorial: number
          id_libro: number
          isbn: string | null
          titulo: string
        }
        Insert: {
          anio_publicacion?: number | null
          descripcion?: string | null
          id_categoria: number
          id_editorial: number
          id_libro?: never
          isbn?: string | null
          titulo: string
        }
        Update: {
          anio_publicacion?: number | null
          descripcion?: string | null
          id_categoria?: number
          id_editorial?: number
          id_libro?: never
          isbn?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "libro_id_categoria_fkey"
            columns: ["id_categoria"]
            isOneToOne: false
            referencedRelation: "categoria"
            referencedColumns: ["id_categoria"]
          },
          {
            foreignKeyName: "libro_id_editorial_fkey"
            columns: ["id_editorial"]
            isOneToOne: false
            referencedRelation: "editorial"
            referencedColumns: ["id_editorial"]
          },
        ]
      }
      libro_autor: {
        Row: {
          id_autor: number
          id_libro: number
        }
        Insert: {
          id_autor: number
          id_libro: number
        }
        Update: {
          id_autor?: number
          id_libro?: number
        }
        Relationships: [
          {
            foreignKeyName: "libro_autor_id_autor_fkey"
            columns: ["id_autor"]
            isOneToOne: false
            referencedRelation: "autor"
            referencedColumns: ["id_autor"]
          },
          {
            foreignKeyName: "libro_autor_id_libro_fkey"
            columns: ["id_libro"]
            isOneToOne: false
            referencedRelation: "libro"
            referencedColumns: ["id_libro"]
          },
        ]
      }
      prestamo: {
        Row: {
          estado: string
          fecha_devolucion_esperada: string | null
          fecha_devolucion_real: string | null
          fecha_prestamo: string
          id_ejemplar: number
          id_prestamo: number
          id_usuario: number
          id_usuario_sistema: number
        }
        Insert: {
          estado?: string
          fecha_devolucion_esperada?: string | null
          fecha_devolucion_real?: string | null
          fecha_prestamo?: string
          id_ejemplar: number
          id_prestamo?: never
          id_usuario: number
          id_usuario_sistema: number
        }
        Update: {
          estado?: string
          fecha_devolucion_esperada?: string | null
          fecha_devolucion_real?: string | null
          fecha_prestamo?: string
          id_ejemplar?: number
          id_prestamo?: never
          id_usuario?: number
          id_usuario_sistema?: number
        }
        Relationships: [
          {
            foreignKeyName: "prestamo_id_ejemplar_fkey"
            columns: ["id_ejemplar"]
            isOneToOne: false
            referencedRelation: "ejemplar"
            referencedColumns: ["id_ejemplar"]
          },
          {
            foreignKeyName: "prestamo_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_usuario"]
          },
          {
            foreignKeyName: "prestamo_id_usuario_sistema_fkey"
            columns: ["id_usuario_sistema"]
            isOneToOne: false
            referencedRelation: "usuario_sistema"
            referencedColumns: ["id_usuario_sistema"]
          },
        ]
      }
      reserva: {
        Row: {
          estado: string
          fecha_expiracion: string
          fecha_reserva: string
          id_libro: number
          id_reserva: number
          id_usuario: number
          id_usuario_sistema: number
        }
        Insert: {
          estado?: string
          fecha_expiracion: string
          fecha_reserva?: string
          id_libro: number
          id_reserva?: never
          id_usuario: number
          id_usuario_sistema: number
        }
        Update: {
          estado?: string
          fecha_expiracion?: string
          fecha_reserva?: string
          id_libro?: number
          id_reserva?: never
          id_usuario?: number
          id_usuario_sistema?: number
        }
        Relationships: [
          {
            foreignKeyName: "reserva_id_libro_fkey"
            columns: ["id_libro"]
            isOneToOne: false
            referencedRelation: "libro"
            referencedColumns: ["id_libro"]
          },
          {
            foreignKeyName: "reserva_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_usuario"]
          },
          {
            foreignKeyName: "reserva_id_usuario_sistema_fkey"
            columns: ["id_usuario_sistema"]
            isOneToOne: false
            referencedRelation: "usuario_sistema"
            referencedColumns: ["id_usuario_sistema"]
          },
        ]
      }
      rol_usuario: {
        Row: {
          dias_prestamo: number
          id_rol: number
          max_prestamos: number
          nombre: string
        }
        Insert: {
          dias_prestamo: number
          id_rol?: never
          max_prestamos: number
          nombre: string
        }
        Update: {
          dias_prestamo?: number
          id_rol?: never
          max_prestamos?: number
          nombre?: string
        }
        Relationships: []
      }
      sancion: {
        Row: {
          estado: string
          fecha_fin: string | null
          fecha_inicio: string
          id_prestamo: number
          id_sancion: number
          id_usuario: number
          id_usuario_sistema: number
          monto: number | null
          motivo: string | null
          tipo: string
        }
        Insert: {
          estado?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id_prestamo: number
          id_sancion?: never
          id_usuario: number
          id_usuario_sistema: number
          monto?: number | null
          motivo?: string | null
          tipo: string
        }
        Update: {
          estado?: string
          fecha_fin?: string | null
          fecha_inicio?: string
          id_prestamo?: number
          id_sancion?: never
          id_usuario?: number
          id_usuario_sistema?: number
          monto?: number | null
          motivo?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "sancion_id_prestamo_fkey"
            columns: ["id_prestamo"]
            isOneToOne: false
            referencedRelation: "prestamo"
            referencedColumns: ["id_prestamo"]
          },
          {
            foreignKeyName: "sancion_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_usuario"]
          },
          {
            foreignKeyName: "sancion_id_usuario_sistema_fkey"
            columns: ["id_usuario_sistema"]
            isOneToOne: false
            referencedRelation: "usuario_sistema"
            referencedColumns: ["id_usuario_sistema"]
          },
        ]
      }
      usuario: {
        Row: {
          cedula: string | null
          codigo_institucional: string
          correo: string
          estado: string
          id_rol: number
          id_usuario: number
          primer_apellido: string
          primer_nombre: string
          segundo_apellido: string | null
          segundo_nombre: string | null
          telefono: string | null
        }
        Insert: {
          cedula?: string | null
          codigo_institucional: string
          correo: string
          estado?: string
          id_rol: number
          id_usuario?: never
          primer_apellido: string
          primer_nombre: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          telefono?: string | null
        }
        Update: {
          cedula?: string | null
          codigo_institucional?: string
          correo?: string
          estado?: string
          id_rol?: number
          id_usuario?: never
          primer_apellido?: string
          primer_nombre?: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          telefono?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuario_id_rol_fkey"
            columns: ["id_rol"]
            isOneToOne: false
            referencedRelation: "rol_usuario"
            referencedColumns: ["id_rol"]
          },
        ]
      }
      usuario_sistema: {
        Row: {
          estado: string
          id_usuario_sistema: number
          password_hash: string
          primer_apellido: string
          primer_nombre: string
          rol_sistema: string
          segundo_apellido: string | null
          segundo_nombre: string | null
          username: string
        }
        Insert: {
          estado?: string
          id_usuario_sistema?: never
          password_hash: string
          primer_apellido: string
          primer_nombre: string
          rol_sistema: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          username: string
        }
        Update: {
          estado?: string
          id_usuario_sistema?: never
          password_hash?: string
          primer_apellido?: string
          primer_nombre?: string
          rol_sistema?: string
          segundo_apellido?: string | null
          segundo_nombre?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
