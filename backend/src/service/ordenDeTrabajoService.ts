import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { getClientByDocument } from "./clienteService"
import { getVehiculoByPatente } from "./vehiculoService"
import { getProductosByCodigo, modificarStockProducto } from "./productosService"

type OrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Ordenes de trabajo"]["Insert"]
type OrdenDeTrabajo = Database["public"]["Tables"]["Ordenes de trabajo"]["Row"]

type DetalleOrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Detalle Ordenes de Trabajo"]["Insert"]

async function getOrdenesDeTrabajo() {
  const { data, error } = await supabase.from("Ordenes de trabajo").select("*")
  return data as OrdenDeTrabajo[]
}

async function getOrdenesDeTrabajoActivas() {
  const { data, error } = await supabase
    .from("Ordenes de trabajo")
    .select("*")
    .eq("Completada", false)

  if (error) {
    throw error
  }
  return data as OrdenDeTrabajo[]
}

async function getOrdenDeTrabajoById(id: number) {
  const { data, error } = await supabase
    .from("Ordenes de trabajo")
    .select("*")
    .eq("id", id)
    .single()
  if (error) {
    throw error
  }
  return data as OrdenDeTrabajo
}

async function createOrdenTrabajo(orden: OrdenDeTrabajoAInsertar) {

  if(!orden.Numero_Documento_Cliente || !orden.Tipo_Documento_Cliente){
    throw new ReferenceError("Falta el numero o tipo de documento del cliente")
  }else{
    const cliente = await getClientByDocument(orden.Tipo_Documento_Cliente, orden.Numero_Documento_Cliente)
    if(cliente === null || cliente.Dado_de_baja === true){
      throw new ReferenceError("Cliente no encontrado")
    }
  }

  if(!orden.Patente_Vehiculo){
    throw new ReferenceError("Falta la patente del vehiculo")
  }else{
    const vehiculo = await getVehiculoByPatente(orden.Patente_Vehiculo)
    if(vehiculo === null){
      throw new ReferenceError("Vehiculo no encontrado")
    }
  }

  const { data, error } = await supabase
    .from("Ordenes de trabajo")
    .insert(orden)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data as OrdenDeTrabajo
}

async function agregarDetallesOrdenDeTrabajo(
  detallesOrden: DetalleOrdenDeTrabajoAInsertar[]
) {

  const orden = await getOrdenDeTrabajoById(detallesOrden[0].OrdenTrabajo)
  if(!orden){
    throw new ReferenceError("Orden de trabajo no encontrada")
  }else{
    if(orden.Completada === true){
      throw new ReferenceError("Orden de trabajo ya completada")
    }
  }
  const diccionario = {}

  for (const detalle of detallesOrden){
    if(diccionario.hasOwnProperty(detalle.Producto)){
      diccionario[detalle.Producto] += detalle.Cantidad
    }else{
      diccionario[detalle.Producto] = detalle.Cantidad
    }
  }

  for (const codigo in diccionario){
    const producto = await getProductosByCodigo(codigo)
    if(!producto){
      throw new ReferenceError("Producto no encontrado")
    }else{
      if(producto.Stock < diccionario[codigo]){
        throw new SyntaxError("Stock insuficiente")
      }
    }
  }

  const { data, error } = await supabase
    .from("Detalle Ordenes de Trabajo")
    .insert(detallesOrden)
    .select()
  if (error) {
    throw error
  }

  for (const codigo in diccionario){
    modificarStockProducto(codigo, -diccionario[codigo])
  }
  return data as DetalleOrdenDeTrabajoAInsertar[]
}

async function completarOrdenDeTrabajo(id: number) {
  const { data, error } = await supabase
    .from("Ordenes de trabajo")
    .update({ Completada: true })
    .eq("id", id)
    .select()
  if (error) {
    throw error
  }
  return data as OrdenDeTrabajo[]
}

export {
  createOrdenTrabajo,
  getOrdenDeTrabajoById,
  getOrdenesDeTrabajo,
  getOrdenesDeTrabajoActivas,
  agregarDetallesOrdenDeTrabajo,
  completarOrdenDeTrabajo,
}