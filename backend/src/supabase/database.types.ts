export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Cliente: {
        Row: {
          Direccion: string | null
          Email: string | null
          id: number
          Nombre: string
          Numero_Documento: number
          Telefono: number | null
          Tipo_Documento: number
        }
        Insert: {
          Direccion?: string | null
          Email?: string | null
          id?: number
          Nombre: string
          Numero_Documento: number
          Telefono?: number | null
          Tipo_Documento?: number
        }
        Update: {
          Direccion?: string | null
          Email?: string | null
          id?: number
          Nombre?: string
          Numero_Documento?: number
          Telefono?: number | null
          Tipo_Documento?: number
        }
        Relationships: [
          {
            foreignKeyName: "Cliente_Tipo_Documento_fkey"
            columns: ["Tipo_Documento"]
            isOneToOne: false
            referencedRelation: "Tipo_documento"
            referencedColumns: ["id"]
          }
        ]
      }
      Marca: {
        Row: {
          id: number
          Nombre: string
        }
        Insert: {
          id?: number
          Nombre: string
        }
        Update: {
          id?: number
          Nombre?: string
        }
        Relationships: []
      }
      "Ordenes de trabajo": {
        Row: {
          Fecha_creacion: string
          id: number
          Numero_Documento_Cliente: number | null
          Patente_Vehiculo: string | null
          Tipo_Documento_Cliente: number | null
        }
        Insert: {
          Fecha_creacion?: string
          id?: number
          Numero_Documento_Cliente?: number | null
          Patente_Vehiculo?: string | null
          Tipo_Documento_Cliente?: number | null
        }
        Update: {
          Fecha_creacion?: string
          id?: number
          Numero_Documento_Cliente?: number | null
          Patente_Vehiculo?: string | null
          Tipo_Documento_Cliente?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Ordenes de trabajo_Patente_Vehiculo_fkey"
            columns: ["Patente_Vehiculo"]
            isOneToOne: false
            referencedRelation: "Vehiculo"
            referencedColumns: ["Patente"]
          },
          {
            foreignKeyName: "Ordenes de trabajo_Tipo_Documento_Cliente_Numero_Documento_fkey"
            columns: ["Tipo_Documento_Cliente", "Numero_Documento_Cliente"]
            isOneToOne: false
            referencedRelation: "Cliente"
            referencedColumns: ["Tipo_Documento", "Numero_Documento"]
          }
        ]
      }
      Productos: {
        Row: {
          Categoria: number | null
          Codigo: string
          Nombre: string
          Precio: number | null
          SubCategoria: number | null
        }
        Insert: {
          Categoria?: number | null
          Codigo: string
          Nombre: string
          Precio?: number | null
          SubCategoria?: number | null
        }
        Update: {
          Categoria?: number | null
          Codigo?: string
          Nombre?: string
          Precio?: number | null
          SubCategoria?: number | null
        }
        Relationships: []
      }
      Tipo_documento: {
        Row: {
          id: number
          Nombre: string
        }
        Insert: {
          id?: number
          Nombre: string
        }
        Update: {
          id?: number
          Nombre?: string
        }
        Relationships: []
      }
      Vehiculo: {
        Row: {
          Año: number
          id: number
          Kilometros: number
          Marca: number
          Modelo: number
          Patente: string
        }
        Insert: {
          Año: number
          id?: number
          Kilometros: number
          Marca: number
          Modelo: number
          Patente: string
        }
        Update: {
          Año?: number
          id?: number
          Kilometros?: number
          Marca?: number
          Modelo?: number
          Patente?: string
        }
        Relationships: [
          {
            foreignKeyName: "Vehiculo_Marca_fkey"
            columns: ["Marca"]
            isOneToOne: false
            referencedRelation: "Marca"
            referencedColumns: ["id"]
          }
        ]
      }
      Vehiculos_de_clientes: {
        Row: {
          ID: number
          Numero_Documento_Cliente: number | null
          Patente_Vehiculo: string
          Tipo_Documento_Cliente: number | null
        }
        Insert: {
          ID?: number
          Numero_Documento_Cliente?: number | null
          Patente_Vehiculo: string
          Tipo_Documento_Cliente?: number | null
        }
        Update: {
          ID?: number
          Numero_Documento_Cliente?: number | null
          Patente_Vehiculo?: string
          Tipo_Documento_Cliente?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Vehiculos_de_clientes_Patente_Vehiculo_fkey"
            columns: ["Patente_Vehiculo"]
            isOneToOne: false
            referencedRelation: "Vehiculo"
            referencedColumns: ["Patente"]
          },
          {
            foreignKeyName: "Vehiculos_de_clientes_Tipo_Documento_Cliente_Numero_Docume_fkey"
            columns: ["Tipo_Documento_Cliente", "Numero_Documento_Cliente"]
            isOneToOne: false
            referencedRelation: "Cliente"
            referencedColumns: ["Tipo_Documento", "Numero_Documento"]
          }
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
