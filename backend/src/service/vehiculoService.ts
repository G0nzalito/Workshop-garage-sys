import { PostgrestError } from "@supabase/supabase-js"
import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"

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
    throw new Error(error.message)
  } else {
    return data as Vehiculo
  }
}

async function uploadVehiculo(nuevoVehiculo: VehiculoAInsertar, cliente: Cliente) {
  const { data, error } = await supabase
    .from("Vehiculo")
    .insert(nuevoVehiculo)
    .select()
  if (error) {
    throw error
  } else {
    await asignarVehiculoACliente(nuevoVehiculo.Patente, cliente)
    return data as VehiculoAInsertar[]
  }
}

async function upodateKilometersOfVehiculo(
  patente: string,
  cambios: { kilometros: number }
) {
  const vehiculo = await getVehiculoByPatente(patente)

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

async function asignarVehiculoACliente(patente: string, cliente: Cliente) {
  const { data, error } = await supabase
    .from("Vehiculos_de_clientes")
    .insert({
      Patente_Vehiculo: patente,
      Numero_Documento_Cliente: cliente.Numero_Documento,
      Tipo_Documento_Cliente: cliente.Tipo_Documento,
    })
    .select()

  if (error) {
    throw error
  }
  return data as VehiculoXCliente[]
}

export {
  asignarVehiculoACliente,
  getVehiculos,
  getVehiculoByPatente,
  uploadVehiculo,
  upodateKilometersOfVehiculo,
}
