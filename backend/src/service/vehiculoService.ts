import { PostgrestError } from "@supabase/supabase-js"
import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { convertirFechaLocal } from "../support/supportFunctions"
import { getModeloById } from "./modelosService"

type VehiculoAInsertar = Database["public"]["Tables"]["Vehiculo"]["Insert"]
type Vehiculo = Database["public"]["Tables"]["Vehiculo"]["Row"]
type VehiculoXCliente =
  Database["public"]["Tables"]["Vehiculos_de_clientes"]["Row"]

type Cliente = Database["public"]["Tables"]["Cliente"]["Row"]

async function getVehiculos() {
  const { data, error } = await supabase.from("Vehiculo").select("*")
  return data as Vehiculo[]
}

async function getVehiculoByPatente(patente: string) {
  const { data, error } = await supabase
    .from("Vehiculo")
    .select("*")
    .eq("Patente", patente)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as Vehiculo
  }
}

async function getDueñoByPatente(patente: string) {
  const { data, error } = await supabase
    .from("Vehiculos_de_clientes")
    .select("*")
    .eq("Patente_Vehiculo", patente)
    .is("Fecha_Remocion_Cliente", null)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as VehiculoXCliente
  }
}

async function uploadVehiculo(
  nuevoVehiculo: VehiculoAInsertar,
  cliente: Cliente
) {
  const { data, error } = await supabase
    .from("Vehiculo")
    .insert(nuevoVehiculo)
    .select()
  if (error) {
    throw error
  } else {
    const date = new Date()
    await asignarVehiculoACliente(
      nuevoVehiculo.Patente,
      cliente,
      convertirFechaLocal(date)
    )
    return data as VehiculoAInsertar[]
  }
}

async function upodateKilometersOfVehiculo(
  patente: string,
  cambios: { kilometros: number }
) {
  const vehiculo = await getVehiculoByPatente(patente)

  if (!vehiculo) {
    throw new ReferenceError("404 Vehiculo no encontrado")
  }
  vehiculo.Kilometros += cambios.kilometros

  const { data, error } = await supabase
    .from("Vehiculo")
    .update(vehiculo)
    .eq("Patente", patente)
    .single()

  if (error) {
    throw error
  }
  return data as Vehiculo
}

async function asignarVehiculoACliente(
  patente: string,
  cliente: Cliente,
  fechaAsignacion: string
) {
  const { data, error } = await supabase
    .from("Vehiculos_de_clientes")
    .insert({
      Patente_Vehiculo: patente,
      Numero_Documento_Cliente: cliente.Numero_Documento,
      Tipo_Documento_Cliente: cliente.Tipo_Documento,
      Fecha_Asignacion_Cliente: fechaAsignacion,
    })
    .select()

  if (error) {
    throw error
  }
  return data as VehiculoXCliente[]
}

async function getVehiculosByFiltros(
  marca?: number,
  modelo?: number,
  motor?: string,
  Numero_Documento?: number,
  Tipo_Documento?: number
) {
  const request = supabase.from("Vehiculo").select()
  if (marca) {
    request.eq("Marca", marca)
  }
  if (modelo) {
    const modelovehiculo = await getModeloById(modelo)
    if (modelovehiculo && modelovehiculo.Marca === marca) {
      request.eq("Modelo", modelo)
    } else {
      throw new ReferenceError(
        "El modelo no existe o no pertence a la marca seleccionada"
      )
    }
  }
  if (motor) {
    request.eq("Motor", motor)
  }

  if (Numero_Documento && Tipo_Documento) {
    const { data, error } = await supabase
      .from("Vehiculos_de_clientes")
      .select("Patente_Vehiculo")
      .eq("Numero_Documento_Cliente", Numero_Documento)
      .eq("Tipo_Documento_Cliente", Tipo_Documento)
      .is("Fecha_Remocion_Cliente", null)

    if (error) {
      throw error
    } else {
      const { data: result, error } = await request.in(
        "Patente",
        data?.map((vehiculo) => vehiculo.Patente_Vehiculo) || []
      )
      if (error) {
        throw error
      } else {
        return result as Vehiculo[]
      }
    }
  } else {
    const { data, error } = await request
    if (error) {
      throw error
    } else {
      return data as Vehiculo[]
    }
  }
}

export {
  asignarVehiculoACliente,
  getVehiculos,
  getVehiculoByPatente,
  uploadVehiculo,
  upodateKilometersOfVehiculo,
  getVehiculosByFiltros,
  getDueñoByPatente
}
