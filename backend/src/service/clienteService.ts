import supabase from "../supabase/client"
import { TablesInsert } from "../supabase/database.types"

async function getClientes() {
  const { data, error } = await supabase.from("Cliente").select("*")
  return data
}

async function uploadClient(nuevoCliente: TablesInsert<"Cliente">) {
  const { error } = await supabase.from("Cliente").insert(nuevoCliente)
  if (error) {
    throw new Error(error.message)
  }
}

export { getClientes, uploadClient }
