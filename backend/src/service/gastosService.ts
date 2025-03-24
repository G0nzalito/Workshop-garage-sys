import supabase from "../supabase/client"
import { createAsientoContable } from "./cajaContableService"
import { Database } from "../supabase/database.types"

type Gasto = Database["public"]["Tables"]["Gastos"]["Row"]
type GastoAInsertar = Database["public"]["Tables"]["Gastos"]["Insert"]
type CuentaGasto = Database["public"]["Tables"]["Cuentas Gastos"]["Row"]

async function getCuentaGasto(idCuenta: number) {
  const { data, error } = await supabase
    .from("Cuentas Gastos")
    .select()
    .eq("id", idCuenta)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw error
  } else {
    return data as CuentaGasto
  }
}

async function getGastos() {
  const { data, error } = await supabase.from("Gastos").select("*")

  if (error) {
    throw error
  }
  return data as Gasto[]
}

async function getGastosByCuenta(cuenta: number) {
  const { data, error } = await supabase
    .from("Gastos")
    .select("*")
    .eq("Cuenta", cuenta)

  if (error) {
    throw error
  }
  return data as Gasto[]
}

async function insertGasto(gasto: GastoAInsertar) {
  const cuenta: CuentaGasto | null = await getCuentaGasto(gasto.Cuenta)

  console.log(cuenta)

  if (cuenta) {
    const { error } = await supabase.from("Gastos").insert(gasto)
    if (error) {
      throw error
    } else {
      await createAsientoContable({
        Monto: gasto.Monto,
        Movimiento: 5,
        Turno: gasto.Turno,
        Detalle: `Gasto en ${cuenta.Nombre}`,
        Sucursal_id: gasto.Sucursal_id,
      })
    }
  } else {
    throw new ReferenceError("La cuenta no existe")
  }
}

export { getGastos, getGastosByCuenta, insertGasto, getCuentaGasto }
