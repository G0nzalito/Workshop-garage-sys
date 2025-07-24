import { PostgrestError } from "@supabase/supabase-js"
import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { string } from "zod"

type ClienteAInsertar = Database["public"]["Tables"]["Cliente"]["Insert"]
type Cliente = Database["public"]["Tables"]["Cliente"]["Row"]
type TiposDocumento = Database["public"]["Tables"]["Tipo_documento"]["Row"]

async function getClientes() {
  const { data, error } = await supabase.from("Cliente").select("*")
  return data as Cliente[]
}

async function getTiposDocumento() {
  const { data, error } = await supabase.from("Tipo_documento").select("*")
  if (error) {
    throw new Error(error.message)
  }
  console.log("Tipos de documento obtenidos:", data)
  return data as TiposDocumento[]
}

async function getClientesFiltrados(
  tipoDocumento?: number,
  numeroDocumento?: number,
  nombre?: string,
  numeroSocio?: number
) {
  const query = supabase.from("Cliente").select("*")
  let filtroActivo = true

  if (tipoDocumento) {
    query.eq("Tipo_Documento", tipoDocumento)
    if (numeroDocumento) {
      query.eq("Numero_Documento", numeroDocumento)
      filtroActivo = false
    }
  }
  if (nombre) {
    query.ilike("Nombre", `%${nombre}%`)
  }
  if (numeroSocio) {
    query.eq("Numero_Socio", numeroSocio)
  }

  if (filtroActivo) {
    query.eq("Dado_de_baja", false)
  }

  const { data, error } = await query

  if (error) {
    throw error
  } else {
    return data as Cliente[]
  }
}

async function getClientByDocument(tipoDocumento, numeroDocumento) {
  const { data, error } = await supabase
    .from("Cliente")
    .select("*")
    .eq("Tipo_Documento", tipoDocumento)
    .eq("Numero_Documento", numeroDocumento)
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

async function asociarCliente(tipoDocumento: number, numeroDocumento: number) {
  const { data, error } = await supabase
    .from("Cliente")
    .select("Numero_Socio")
    .not("Numero_Socio", "is", null)
    .order("Numero_Socio", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    throw new Error(error.message)
  }

  // console.log("Último número de socio:", data)

  if (data && data?.Numero_Socio) {
    const { data: nuevoCliente, error: errorNuevo } = await supabase
      .from("Cliente")
      .update({ Numero_Socio: data?.Numero_Socio + 1 })
      .eq("Tipo_Documento", tipoDocumento)
      .eq("Numero_Documento", numeroDocumento)
      .select("*")
      .single()

    if (errorNuevo) {
      console.error("Error al asociar cliente:", errorNuevo)
      return null
    } else {
      console.log("Cliente asociado:", nuevoCliente)

      return nuevoCliente as Cliente
    }
  }
}

async function uploadClient(
  nuevoCliente: ClienteAInsertar,
  asociacion: boolean
) {
  const { data: clienteCreado, error: errorInsert } = await supabase
    .from("Cliente")
    .insert(nuevoCliente)
    .select()
    .single()
  if (errorInsert) {
    throw errorInsert
  } else {
    if (asociacion) {
      const clienteAsociado = await asociarCliente(
        clienteCreado.Tipo_Documento,
        clienteCreado.Numero_Documento
      )
      // return clienteAsociado as Cliente
    }

    return clienteCreado as Cliente
  }
}

async function createTipoDocuemnto(nombre: string, TipoCliente: string) {
  const { data, error } = await supabase
    .from("Tipo_documento")
    .insert({ Nombre: nombre, "Tipo de cliente": TipoCliente })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as TiposDocumento
}

async function updateClient(
  numeroDocumento,
  tipoDocumento,
  cambios: {
    direccion: string
    telefono: number
    email: string
    asociacion?: boolean
  },
  baja: boolean
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

  if (cliente.Numero_Socio && !cambios.asociacion) {
    cliente.Numero_Socio = null
  }

  if (cliente.Dado_de_baja && !baja) {
    cliente.Dado_de_baja = false
  }

  const { data, error } = await supabase
    .from("Cliente")
    .update(cliente)
    .eq("Numero_Documento", numeroDocumento)
    .eq("Tipo_Documento", tipoDocumento)
    .select()
    .single()
  if (data) {
    if (cliente.Numero_Socio === null && cambios.asociacion) {
      console.log("Asociando cliente...")
      const clienteAsociado = await asociarCliente(
        tipoDocumento,
        numeroDocumento
      )
      return clienteAsociado as Cliente
    } else {
      return data as Cliente
    }
  } else {
    throw error
  }
}

async function deleteClient(tipoDocumento, numeroDocumento) {
  const { data } = await supabase
    .from("Cliente")
    .update({ Dado_de_baja: true })
    .eq("Tipo_Documento", tipoDocumento)
    .eq("Numero_Documento", numeroDocumento)
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
  getTiposDocumento,
  getClientByDocument,
  getClientesFiltrados,
  uploadClient,
  createTipoDocuemnto,
  updateClient,
  deleteClient,
}
