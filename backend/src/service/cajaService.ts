import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import {createAsientoContable} from './cajaContableService'

type Caja = Database["public"]["Tables"]["Caja"]["Row"]
type CajaAInsertar = Database["public"]["Tables"]["Caja"]["Insert"]

async function getCaja() {
  const { data, error } = await supabase.from("Caja").select("*")

  if (error) {
    throw error
  }
  return data as Caja[]
}

async function getCajaDesdeFecha(fechaMinima: string, fechaMaxima?: string) {
  if (fechaMaxima === undefined) {
    const { data, error } = await supabase
      .from("Caja")
      .select("*")
      .gte("Fecha", fechaMinima)

    if (error) {
      throw error
    }
    return data as Caja[]

  }else{
      const { data: data2, error: error2 } = await supabase
        .from("Caja")
        .select("*")
        .gte("Fecha", fechaMinima)
        .lte("Fecha", fechaMaxima)
  
      if (error2) {
        throw error2
      }
      return data2 as Caja[]
  }
}

async function registrarVenta(caja: CajaAInsertar) {
  const { data, error } = await supabase
  .from("Caja")
  .insert(caja)
  .select("*")
  .limit(1)
  .single()

  if (error) {
    throw error
  }

  if(caja.Forma_de_Pago === 1){
    const asiento = {
      Monto: caja.Sub_Total,
      Movimiento: 3,
      Turno: caja.Turno,
      Detalle: "Venta de productos en efectivo",
      Fecha: caja.Fecha,
      Sucursal_id: caja.Sucursal_id
    }
    try {
      await createAsientoContable(asiento)
    } catch (error) {
      throw error
    }
  }
  return data as Caja
}

export { getCaja, getCajaDesdeFecha, registrarVenta }
