import { PostgrestError } from "@supabase/supabase-js"
import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"

type ClienteAInsertar = Database["public"]["Tables"]["Cliente"]["Insert"]
type Cliente = Database["public"]["Tables"]["Cliente"]["Row"]

async function getClientes() {
  const { data, error } = await supabase.from("Cliente").select("*")
  return data as Cliente[]
}

async function getClientByDocument(tipoDocumento, numeroDocumento) {
  const { data, error } = await supabase
    .from("Cliente")
    .select('*')
    .eq("Tipo_Documento", tipoDocumento)
    .eq("Numero_Documento", numeroDocumento)
    .eq("Dado_de_baja", false)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as Cliente
  }
}

async function uploadClient(nuevoCliente: ClienteAInsertar) {
  const { data, error } = await supabase
    .from("Cliente")
    .insert(nuevoCliente)
    .select()
  if (error) {
    throw error
  } else {
    return data as ClienteAInsertar[]
  }
}

async function updateClient(
  numeroDocumento,
  tipoDocumento,
  cambios: {
    direccion: string
    telefono: number
    email: string
    numeroSocio: number
  }
) {
  const cliente = await getClientByDocument(tipoDocumento, numeroDocumento)

  if (!cliente) {
    throw new ReferenceError("404 Cliente no encontrado")
  }

  if (cambios.direccion) {
    cliente.Direccion = cambios.direccion
  }
  if (cambios.telefono) {
    cliente.Telefono = cambios.telefono
  }
  if (cambios.email) {
    cliente.Email = cambios.email
  }
  if (cambios.numeroSocio) {
    cliente.Numero_Socio = cambios.numeroSocio
  }

  const { error } = await supabase.from("Cliente").update(cliente).match({
    Numero_Documento: numeroDocumento,
    Tipo_Documento: tipoDocumento,
  })

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
