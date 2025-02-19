import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"

type AsientoContable = Database["public"]["Tables"]["Caja Contable"]["Row"]
type AsientoContableAInsertar =
  Database["public"]["Tables"]["Caja Contable"]["Insert"]

async function getConcepto(idConcepto: number){
  const { data, error } = await supabase
  .from("Conceptos Caja Contable")
  .select()
  .eq("id", idConcepto)
  .single()


  if (error) {
    if(error.code === "PGRST116"){
      return null
    }
    throw error
  } else {
    return data
  }
}

async function getAsientosContables() {
  const { data, error } = await supabase.from("Caja Contable").select("*")
  if (error) {
    throw error
  }
  return data as AsientoContable[]
}

async function getAsientosContablesDesdeFecha(fechaMinima: string) {
  const { data, error } = await supabase
    .from("Caja Contable")
    .select("*")
    .gte("Fecha", fechaMinima)
  if (error) {
    throw error
  }
  return data as AsientoContable[]
}

async function createAsientoContable(asiento: AsientoContableAInsertar) {
  const concepto = await getConcepto(asiento.Movimiento)

  if (!concepto) {
    throw new ReferenceError("El concepto no existe")
  } else {
    const { error } = await supabase.from("Caja Contable").insert(asiento)

    if (error) {
      throw error
    }
  }
}

export { getAsientosContables, createAsientoContable, getAsientosContablesDesdeFecha, getConcepto }
