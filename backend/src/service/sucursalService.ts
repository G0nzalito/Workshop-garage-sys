import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"

export const getSucursales = async () => {
  const { data, error } = await supabase.from("Sucursales").select("*")
  return data as Database["public"]["Tables"]["Sucursales"]["Row"][]
}
