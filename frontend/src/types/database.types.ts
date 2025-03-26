export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      Caja: {
        Row: {
          Cuotas: number | null
          Descripcion: string | null
          Fecha: string
          Forma_de_Pago: number
          Fuente_MKT: number
          N_Autorizacion: number | null
          N_Cupon: number | null
          N_Lote: number | null
          Numero_Documento_Cliente: number
          Operador_1: string | null
          Operador_2: string | null
          Sub_Total: number
          Sucursal_id: number
          Supervisor: string | null
          Tarjeta: number | null
          Tipo_de_comprobante: number | null
          Tipo_Documento_Cliente: number
          Turno: number
          Vehiculo: string | null
        }
        Insert: {
          Cuotas?: number | null
          Descripcion?: string | null
          Fecha?: string
          Forma_de_Pago: number
          Fuente_MKT: number
          N_Autorizacion?: number | null
          N_Cupon?: number | null
          N_Lote?: number | null
          Numero_Documento_Cliente: number
          Operador_1?: string | null
          Operador_2?: string | null
          Sub_Total: number
          Sucursal_id: number
          Supervisor?: string | null
          Tarjeta?: number | null
          Tipo_de_comprobante?: number | null
          Tipo_Documento_Cliente: number
          Turno: number
          Vehiculo?: string | null
        }
        Update: {
          Cuotas?: number | null
          Descripcion?: string | null
          Fecha?: string
          Forma_de_Pago?: number
          Fuente_MKT?: number
          N_Autorizacion?: number | null
          N_Cupon?: number | null
          N_Lote?: number | null
          Numero_Documento_Cliente?: number
          Operador_1?: string | null
          Operador_2?: string | null
          Sub_Total?: number
          Sucursal_id?: number
          Supervisor?: string | null
          Tarjeta?: number | null
          Tipo_de_comprobante?: number | null
          Tipo_Documento_Cliente?: number
          Turno?: number
          Vehiculo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'Caja_Forma_de_Pago_fkey'
            columns: ['Forma_de_Pago']
            isOneToOne: false
            referencedRelation: 'Medios Pago'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Caja_Fuente_MKT_fkey'
            columns: ['Fuente_MKT']
            isOneToOne: false
            referencedRelation: 'Fuente MKT'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Caja_Sucursal_id_fkey'
            columns: ['Sucursal_id']
            isOneToOne: false
            referencedRelation: 'Sucursales'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Caja_Tarjeta_fkey'
            columns: ['Tarjeta']
            isOneToOne: false
            referencedRelation: 'Tarjetas'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Caja_Tipo_Documento_Cliente_Numero_Documento_Cliente_fkey'
            columns: ['Tipo_Documento_Cliente', 'Numero_Documento_Cliente']
            isOneToOne: false
            referencedRelation: 'Cliente'
            referencedColumns: ['Tipo_Documento', 'Numero_Documento']
          },
          {
            foreignKeyName: 'Caja_Vehiculo_fkey'
            columns: ['Vehiculo']
            isOneToOne: false
            referencedRelation: 'Vehiculo'
            referencedColumns: ['Patente']
          }
        ]
      }
      'Caja Contable': {
        Row: {
          Detalle: string | null
          Fecha: string
          Monto: number
          Movimiento: number
          Sucursal_id: number
          Turno: number
        }
        Insert: {
          Detalle?: string | null
          Fecha?: string
          Monto: number
          Movimiento: number
          Sucursal_id: number
          Turno: number
        }
        Update: {
          Detalle?: string | null
          Fecha?: string
          Monto?: number
          Movimiento?: number
          Sucursal_id?: number
          Turno?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Caja Contable_Movimiento_fkey'
            columns: ['Movimiento']
            isOneToOne: false
            referencedRelation: 'Conceptos Caja Contable'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Caja Contable_Sucursal_id_fkey'
            columns: ['Sucursal_id']
            isOneToOne: false
            referencedRelation: 'Sucursales'
            referencedColumns: ['id']
          }
        ]
      }
      Categorias: {
        Row: {
          Dada_de_baja: boolean
          Descripcion: string
          id: number
        }
        Insert: {
          Dada_de_baja?: boolean
          Descripcion: string
          id?: number
        }
        Update: {
          Dada_de_baja?: boolean
          Descripcion?: string
          id?: number
        }
        Relationships: []
      }
      Cliente: {
        Row: {
          Dado_de_baja: boolean
          Direccion: string | null
          Email: string | null
          id: number
          Nombre: string
          Numero_Documento: number
          Numero_Socio: number | null
          Telefono: number | null
          Tipo_Documento: number
        }
        Insert: {
          Dado_de_baja?: boolean
          Direccion?: string | null
          Email?: string | null
          id?: number
          Nombre: string
          Numero_Documento: number
          Numero_Socio?: number | null
          Telefono?: number | null
          Tipo_Documento?: number
        }
        Update: {
          Dado_de_baja?: boolean
          Direccion?: string | null
          Email?: string | null
          id?: number
          Nombre?: string
          Numero_Documento?: number
          Numero_Socio?: number | null
          Telefono?: number | null
          Tipo_Documento?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Cliente_Tipo_Documento_fkey'
            columns: ['Tipo_Documento']
            isOneToOne: false
            referencedRelation: 'Tipo_documento'
            referencedColumns: ['id']
          }
        ]
      }
      Cobranzas: {
        Row: {
          Autorizacion: number | null
          Cupon: number | null
          Facturas_Canceladas: string | null
          Fecha: string
          Forma_de_Pago: number
          id: number
          Lote: number | null
          Monto: number
          Numero_Documento_Cliente: number
          Observaciones: string | null
          Tarjeta: number | null
          Tipo_Documento_Cliente: number
          Turno: number
        }
        Insert: {
          Autorizacion?: number | null
          Cupon?: number | null
          Facturas_Canceladas?: string | null
          Fecha?: string
          Forma_de_Pago: number
          id?: number
          Lote?: number | null
          Monto: number
          Numero_Documento_Cliente: number
          Observaciones?: string | null
          Tarjeta?: number | null
          Tipo_Documento_Cliente: number
          Turno: number
        }
        Update: {
          Autorizacion?: number | null
          Cupon?: number | null
          Facturas_Canceladas?: string | null
          Fecha?: string
          Forma_de_Pago?: number
          id?: number
          Lote?: number | null
          Monto?: number
          Numero_Documento_Cliente?: number
          Observaciones?: string | null
          Tarjeta?: number | null
          Tipo_Documento_Cliente?: number
          Turno?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Cobranzas_Tipo_Documento_Cliente_Numero_Documento_Cliente_fkey'
            columns: ['Tipo_Documento_Cliente', 'Numero_Documento_Cliente']
            isOneToOne: false
            referencedRelation: 'Cliente'
            referencedColumns: ['Tipo_Documento', 'Numero_Documento']
          }
        ]
      }
      'Conceptos Caja Contable': {
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
      'Conceptos Facturas': {
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
      'Consumos Stock': {
        Row: {
          Cantidad: number
          Descripcion: string | null
          Fecha: string
          id: number
          KilometroXDia: number
          Orden_Trabajo: number | null
          Producto: string
          Proximo_Service: string
          SubTotal: number
        }
        Insert: {
          Cantidad: number
          Descripcion?: string | null
          Fecha?: string
          id?: number
          KilometroXDia: number
          Orden_Trabajo?: number | null
          Producto: string
          Proximo_Service: string
          SubTotal: number
        }
        Update: {
          Cantidad?: number
          Descripcion?: string | null
          Fecha?: string
          id?: number
          KilometroXDia?: number
          Orden_Trabajo?: number | null
          Producto?: string
          Proximo_Service?: string
          SubTotal?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Consumos Stock_Orden De Trabajo_fkey'
            columns: ['Orden_Trabajo']
            isOneToOne: false
            referencedRelation: 'Ordenes de trabajo'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Consumos Stock_Producto_fkey'
            columns: ['Producto']
            isOneToOne: false
            referencedRelation: 'Productos'
            referencedColumns: ['Codigo']
          }
        ]
      }
      'Cuentas Gastos': {
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
      'Fuente MKT': {
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
      Gastos: {
        Row: {
          Comprobante: boolean
          Cuenta: number
          Fecha: string
          Monto: number
          Observaciones: string | null
          Turno: number
          Sucursal_id: number
        }
        Insert: {
          Comprobante?: boolean
          Cuenta: number
          Fecha?: string
          Monto: number
          Observaciones?: string | null
          Turno: number
          Sucursal_id: number
        }
        Update: {
          Comprobante?: boolean
          Cuenta?: number
          Fecha?: string
          Monto?: number
          Observaciones?: string | null
          Turno?: number
          Sucursal_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Gastos_Cuenta_fkey'
            columns: ['Cuenta']
            isOneToOne: false
            referencedRelation: 'Cuentas Gastos'
            referencedColumns: ['id']
          }
        ]
      }
      Historial_Precios: {
        Row: {
          Fecha_De_Cambio: string | null
          id: number
          Precio_Antiguo: number | null
          Product_Id: string
        }
        Insert: {
          Fecha_De_Cambio?: string | null
          id?: number
          Precio_Antiguo?: number | null
          Product_Id: string
        }
        Update: {
          Fecha_De_Cambio?: string | null
          id?: number
          Precio_Antiguo?: number | null
          Product_Id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'Historial_Precios_Product_Id_fkey'
            columns: ['Product_Id']
            isOneToOne: false
            referencedRelation: 'Productos'
            referencedColumns: ['Codigo']
          }
        ]
      }
      Marca_de_Productos: {
        Row: {
          Dado_de_baja: boolean
          id: number
          Nombre: string
        }
        Insert: {
          Dado_de_baja?: boolean
          id?: number
          Nombre: string
        }
        Update: {
          Dado_de_baja?: boolean
          id?: number
          Nombre?: string
        }
        Relationships: []
      }
      Marca_de_Vehiculos: {
        Row: {
          Dada_de_baja: boolean | null
          id: number
          Nombre: string
        }
        Insert: {
          Dada_de_baja?: boolean | null
          id?: number
          Nombre: string
        }
        Update: {
          Dada_de_baja?: boolean | null
          id?: number
          Nombre?: string
        }
        Relationships: []
      }
      'Medios Pago': {
        Row: {
          id: number
          Interes: number
          Nombre: string
        }
        Insert: {
          id?: number
          Interes?: number
          Nombre: string
        }
        Update: {
          id?: number
          Interes?: number
          Nombre?: string
        }
        Relationships: []
      }
      Modelos: {
        Row: {
          id: number
          Marca: number | null
          Nombre: string
        }
        Insert: {
          id?: number
          Marca?: number | null
          Nombre: string
        }
        Update: {
          id?: number
          Marca?: number | null
          Nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: 'Modelos_Marca_fkey'
            columns: ['Marca']
            isOneToOne: false
            referencedRelation: 'Marca_de_Vehiculos'
            referencedColumns: ['id']
          }
        ]
      }
      'Ordenes de trabajo': {
        Row: {
          Completada: boolean
          Fecha_creacion: string
          id: number
          Numero_Documento_Cliente: number
          Patente_Vehiculo: string
          Tipo_Documento_Cliente: number
        }
        Insert: {
          Completada?: boolean
          Fecha_creacion?: string
          id?: number
          Numero_Documento_Cliente: number
          Patente_Vehiculo: string
          Tipo_Documento_Cliente: number
        }
        Update: {
          Completada?: boolean
          Fecha_creacion?: string
          id?: number
          Numero_Documento_Cliente?: number
          Patente_Vehiculo?: string
          Tipo_Documento_Cliente?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Ordenes de trabajo_Patente_Vehiculo_fkey'
            columns: ['Patente_Vehiculo']
            isOneToOne: false
            referencedRelation: 'Vehiculo'
            referencedColumns: ['Patente']
          },
          {
            foreignKeyName: 'Ordenes de trabajo_Tipo_Documento_Cliente_Numero_Documento_fkey'
            columns: ['Tipo_Documento_Cliente', 'Numero_Documento_Cliente']
            isOneToOne: false
            referencedRelation: 'Cliente'
            referencedColumns: ['Tipo_Documento', 'Numero_Documento']
          }
        ]
      }
      Productos: {
        Row: {
          Categoria: number
          Codigo: string
          Dado_de_baja: boolean
          Descripcion: string
          Marca: number
          Precio: number
          Proveedor: number
          SubCategoria: number | null
        }
        Insert: {
          Categoria: number
          Codigo: string
          Dado_de_baja?: boolean
          Descripcion: string
          Marca: number
          Precio?: number
          Proveedor: number
          SubCategoria?: number | null
        }
        Update: {
          Categoria?: number
          Codigo?: string
          Dado_de_baja?: boolean
          Descripcion?: string
          Marca?: number
          Precio?: number
          Proveedor?: number
          SubCategoria?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'Productos_Categoria_fkey'
            columns: ['Categoria']
            isOneToOne: false
            referencedRelation: 'Categorias'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Productos_Marca_fkey'
            columns: ['Marca']
            isOneToOne: false
            referencedRelation: 'Marca_de_Productos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Productos_Proveedor_fkey'
            columns: ['Proveedor']
            isOneToOne: false
            referencedRelation: 'Proveedores'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'Productos_SubCategoria_fkey'
            columns: ['SubCategoria']
            isOneToOne: false
            referencedRelation: 'SubCategorias'
            referencedColumns: ['id']
          }
        ]
      }
      Proveedores: {
        Row: {
          Dado_de_baja: boolean
          id: number
          Nombre: string
        }
        Insert: {
          Dado_de_baja?: boolean
          id?: number
          Nombre: string
        }
        Update: {
          Dado_de_baja?: boolean
          id?: number
          Nombre?: string
        }
        Relationships: []
      }
      Stock: {
        Row: {
          Cantidad: number
          Codigo: string
          id: number
          Sucursal_id: number
        }
        Insert: {
          Cantidad?: number
          Codigo: string
          id?: number
          Sucursal_id: number
        }
        Update: {
          Cantidad?: number
          Codigo?: string
          id?: number
          Sucursal_id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Stock_Codigo_fkey'
            columns: ['Codigo']
            isOneToOne: false
            referencedRelation: 'Productos'
            referencedColumns: ['Codigo']
          },
          {
            foreignKeyName: 'Stock_Sucursal_id_fkey'
            columns: ['Sucursal_id']
            isOneToOne: false
            referencedRelation: 'Sucursales'
            referencedColumns: ['id']
          }
        ]
      }
      SubCategorias: {
        Row: {
          Categoria: number
          Dada_de_baja: boolean | null
          Descripción: string
          id: number
        }
        Insert: {
          Categoria: number
          Dada_de_baja?: boolean | null
          Descripción: string
          id?: number
        }
        Update: {
          Categoria?: number
          Dada_de_baja?: boolean | null
          Descripción?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: 'SubCategorias_Categoria_fkey'
            columns: ['Categoria']
            isOneToOne: false
            referencedRelation: 'Categorias'
            referencedColumns: ['id']
          }
        ]
      }
      Sucursales: {
        Row: {
          Dirección: string
          id: number
          Nombre: string
          Telefóno: number
        }
        Insert: {
          Dirección: string
          id?: number
          Nombre?: string
          Telefóno: number
        }
        Update: {
          Dirección?: string
          id?: number
          Nombre?: string
          Telefóno?: number
        }
        Relationships: []
      }
      Tarjetas: {
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
          Motor: string
          Patente: string
        }
        Insert: {
          Año: number
          id?: number
          Kilometros: number
          Marca: number
          Modelo: number
          Motor: string
          Patente: string
        }
        Update: {
          Año?: number
          id?: number
          Kilometros?: number
          Marca?: number
          Modelo?: number
          Motor?: string
          Patente?: string
        }
        Relationships: [
          {
            foreignKeyName: 'Vehiculo_Marca_fkey'
            columns: ['Marca']
            isOneToOne: false
            referencedRelation: 'Marca_de_Vehiculos'
            referencedColumns: ['id']
          }
        ]
      }
      Vehiculos_de_clientes: {
        Row: {
          Fecha_Asignacion_Cliente: string
          ID: number
          Numero_Documento_Cliente: number | null
          Patente_Vehiculo: string
          Tipo_Documento_Cliente: number | null
        }
        Insert: {
          Fecha_Asignacion_Cliente?: string
          ID?: number
          Numero_Documento_Cliente?: number | null
          Patente_Vehiculo: string
          Tipo_Documento_Cliente?: number | null
        }
        Update: {
          Fecha_Asignacion_Cliente?: string
          ID?: number
          Numero_Documento_Cliente?: number | null
          Patente_Vehiculo?: string
          Tipo_Documento_Cliente?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'Vehiculos_de_clientes_Patente_Vehiculo_fkey'
            columns: ['Patente_Vehiculo']
            isOneToOne: false
            referencedRelation: 'Vehiculo'
            referencedColumns: ['Patente']
          },
          {
            foreignKeyName: 'Vehiculos_de_clientes_Tipo_Documento_Cliente_Numero_Docume_fkey'
            columns: ['Tipo_Documento_Cliente', 'Numero_Documento_Cliente']
            isOneToOne: false
            referencedRelation: 'Cliente'
            referencedColumns: ['Tipo_Documento', 'Numero_Documento']
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

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
