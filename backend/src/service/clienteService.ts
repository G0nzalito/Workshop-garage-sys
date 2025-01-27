import { PostgrestError } from "@supabase/supabase-js"
import supabase from "../supabase/client"
import { TablesInsert, Database } from "../supabase/database.types"

async function getClientes() {
  const { data, error } = await supabase.from("Cliente").select("*")
  return data
}

async function getClientByDocument(tipoDocumento, numeroDocumento) {
  const { data, error } = await supabase
    .from("Cliente")
    .select("*")
    .eq("Tipo_Documento", tipoDocumento)
    .eq("Numero_Documento", numeroDocumento)
  if (error) {
    throw new Error(error.message)
  } else {
    return data
  }
}

async function uploadClient(nuevoCliente) {
  const { data, error } = await supabase
    .from("Cliente")
    .insert(nuevoCliente)
    .select()
  if (error) {
    throw error
  } else {
    return data
  }
}

async function updateClient(
  numeroDocumento,
  tipoDocumento,
  cambios: { direccion: string; telefono: number; email: string }
) {
  const cliente: Database["public"]["Tables"]["Cliente"]["Update"] = await supabase
    .from("Cliente")
    .select()
    .eq("Numero_Documento", numeroDocumento)
    .eq("Tipo_Documento", tipoDocumento)
    .single()[0]

  if (cambios.direccion) {
    cliente.Direccion = cambios.direccion
  }
  if (cambios.telefono) {
    cliente.Telefono = cambios.telefono
  }
  if (cambios.email) {
    cliente.Email = cambios.email
  }
  const { error } = await supabase
    .from("Cliente")
    .update(cliente)
    .match({ id: cliente.id })
  if (error) {
    throw new Error(error.message)
  }
}

async function deleteClient(tipoDocumento, numeroDocumento) {
  const { data } = await supabase
    .from("Cliente")
    .delete()
    .match({
      Numero_Documento: numeroDocumento,
      Tipo_Documento: tipoDocumento,
    })
    .select()
  if (data?.length === 0) {
    throw new PostgrestError({
      message: "Client not found",
      details: "Client not found",
      hint: "",
      code: "404",
    })
  }
  return data
}

export {
  getClientes,
  getClientByDocument,
  uploadClient,
  updateClient,
  deleteClient,
}
