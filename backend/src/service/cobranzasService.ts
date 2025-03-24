import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import {createAsientoContable} from './cajaContableService'

type Cobranza = Database["public"]["Tables"]["Cobranzas"]["Row"]
type CobranzaAInsertar = Database["public"]["Tables"]["Cobranzas"]["Insert"]

async function getCobros() {
  const { data, error } = await supabase.from("Cobranzas").select("*")

  if (error) {
    throw error
  }
  return data as Cobranza[]
}

async function getCobrosDesdeFecha(fechaMinima: string, fechaMaxima?: string) {
  if (fechaMaxima === undefined) {
    const { data, error } = await supabase
      .from("Cobranzas")
      .select("*")
      .gte("Fecha", fechaMinima)

    if (error) {
      throw error
    }
    return data as Cobranza[]

  }else{
      const { data: data2, error: error2 } = await supabase
        .from("Cobranzas")
        .select("*")
        .gte("Fecha", fechaMinima)
        .lte("Fecha", fechaMaxima)
  
      if (error2) {
        throw error2
      }
      return data2 as Cobranza[]
  }
}

async function registrarCobros(cobranza: CobranzaAInsertar, sucursal_id: number) {
  const { data, error } = await supabase
  .from("Cobranzas")
  .insert(cobranza)
  .select("*")
  .limit(1)
  .single()

  if (error) {
    throw error
  }

  if(cobranza.Forma_de_Pago === 1){
    const asiento = {
      Monto: cobranza.Monto,
      Movimiento: 3,
      Turno: cobranza.Turno,
      Detalle: "Cobro de CC en efectivo",
      Fecha: cobranza.Fecha,
      Sucursal_id: sucursal_id
    }
    try {
      await createAsientoContable(asiento)
    } catch (error) {
      throw error
    }
  }
  return data as Cobranza
}

export { getCobros, getCobrosDesdeFecha, registrarCobros }
