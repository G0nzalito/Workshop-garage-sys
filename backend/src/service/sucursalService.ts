import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"

type Sucursal = Database["public"]["Tables"]["Sucursales"]["Row"]

export const getSucursales = async () => {
  const { data, error } = await supabase.from("Sucursales").select("*")
  return data as Database["public"]["Tables"]["Sucursales"]["Row"][]
}

export async function getSucursalById(id: number) {
  const { data, error } = await supabase
    .from("Sucursales")
    .select("*")
    .eq("id", id)
    // .single()
  if (error) {
    console.log(error)
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data[0] as Sucursal
  }
}
