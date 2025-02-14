import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"

type ProveedorAInsertar = Database["public"]["Tables"]["Proveedores"]["Insert"]
type Proveedor = Database["public"]["Tables"]["Proveedores"]["Row"]

async function getProveedores() {
  const { data, error } = await supabase.from("Proveedores").select("*")
  return data as Proveedor[]
}

async function getProveedorById(id: number) {
  const { data, error } = await supabase
    .from("Proveedores")
    .select("*")
    .eq("id", id)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as Proveedor
  }
}

async function getProveedorByNombre(Nombre: string) {
  const { data, error } = await supabase
    .from("Proveedores")
    .select("*")
    .eq("Nombre", Nombre)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as Proveedor
  }
}

async function getProveedorActivo() {
  const { data, error } = await supabase
    .from("Proveedores")
    .select("*")
    .eq("Dado_de_baja", false)
  if (error) {
    throw error
  } else {
    return data as Proveedor[]
  }
}

async function uploadProveedor(nuevoProveedor: ProveedorAInsertar) {
  const { data, error } = await supabase
    .from("Proveedores")
    .insert(nuevoProveedor)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data as Proveedor
}

async function disableProveedor(id: number) {
  const { data, error } = await supabase
    .from("Proveedores")
    .update({ Dado_de_baja: true })
    .eq("id", id)
    .single()
  if (error) {
    throw error
  }
  return data as Proveedor
}

async function enableProveedor(id: number) {
  const { data, error } = await supabase
    .from("Proveedores")
    .update({ Dado_de_baja: false })
    .eq("id", id)
    .single()
  if (error) {
    throw error
  }
  return data as Proveedor
}
export {
  getProveedores,
  getProveedorById,
  uploadProveedor,
  disableProveedor,
  enableProveedor,
  getProveedorActivo,
  getProveedorByNombre,
}
