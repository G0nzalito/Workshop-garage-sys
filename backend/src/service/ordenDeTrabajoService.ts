import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { getClientByDocument } from "./clienteService"
import { getVehiculoByPatente } from "./vehiculoService"
import {
  getProductosByCodigo,
  modificarStockProducto,
  obtenerStockProducto,
} from "./productosService"
import { convertirFechaLocal } from "../support/supportFunctions"

type OrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Ordenes de trabajo"]["Insert"]
type OrdenDeTrabajo = Database["public"]["Tables"]["Ordenes de trabajo"]["Row"]

type DetalleOrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Consumos Stock"]["Insert"]

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
    if (error.code === "PGRST116") {
      return null
    }
    throw error
  }
  return data as OrdenDeTrabajo
}

async function obtenerOrdenesDeTrabajoPorFiltros(
  Tipo_Documento?: number,
  Numero_Documento?: number,
  Patente?: string,
  FechaDesde?: string,
  FechaHasta?: string,
  Finalizadas?: boolean
) {
  console.log(arguments)
  const query = supabase.from("Ordenes de trabajo").select("*")

  if (Tipo_Documento) {
    query.eq("Tipo_Documento_Cliente", Tipo_Documento)
  }
  if (Numero_Documento) {
    query.eq("Numero_Documento_Cliente", Numero_Documento)
  }
  if (Patente) {
    query.eq("Patente_Vehiculo", Patente)
  }
  if (FechaDesde) {
    query.gte("Fecha_creacion", convertirFechaLocal(new Date(FechaDesde)))
  }
  if (FechaHasta) {
    query.lte("Fecha_creacion", convertirFechaLocal(new Date(FechaHasta)))
  }
  if (!Finalizadas) {
    query.is("Completada", false)
  }

  const { data, error } = await query
  if (error) {
    throw error
  }
  return data as OrdenDeTrabajo[]
}

async function createOrdenTrabajo(
  orden: OrdenDeTrabajoAInsertar,
  Detalles?: DetalleOrdenDeTrabajoAInsertar[]
) {
  if (!orden.Numero_Documento_Cliente || !orden.Tipo_Documento_Cliente) {
    throw new ReferenceError("Falta el numero o tipo de documento del cliente")
  } else {
    const cliente = await getClientByDocument(
      orden.Tipo_Documento_Cliente,
      orden.Numero_Documento_Cliente
    )
    if (cliente === null || cliente.Dado_de_baja === true) {
      throw new ReferenceError("Cliente no encontrado")
    }
  }

  if (!orden.Patente_Vehiculo) {
    throw new ReferenceError("Falta la patente del vehiculo")
  } else {
    const vehiculo = await getVehiculoByPatente(orden.Patente_Vehiculo)
    if (vehiculo === null) {
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
  if (Detalles && Detalles.length > 0) {
    const detallesOrden = await agregarDetallesOrdenDeTrabajo(Detalles, data.id)
    if (!detallesOrden) {
      throw new ReferenceError(
        "No se pudieron agregar los detalles de la orden"
      )
    }
  }
  return data as OrdenDeTrabajo
}

async function agregarDetallesOrdenDeTrabajo(
  detallesOrden: DetalleOrdenDeTrabajoAInsertar[],
  ordenDeTrabajo: number
) {
  //@ts-ignore Lidire contigo más tarde
  const orden = await getOrdenDeTrabajoById(ordenDeTrabajo)
  if (!orden) {
    throw new ReferenceError("Orden de trabajo no encontrada")
  } else {
    if (orden.Completada === true) {
      throw new ReferenceError("Orden de trabajo ya completada")
    }
  }
  const diccionario = {}

  // console.log("Detalles a agregar:", detallesOrden)

  for (const detalle of detallesOrden) {
    if (diccionario.hasOwnProperty(detalle.Producto)) {
      diccionario[detalle.Producto] += detalle.Cantidad
    } else {
      diccionario[detalle.Producto] = detalle.Cantidad
    }
  }

  const hoy = convertirFechaLocal(new Date())

  const detallesOrdenAGuardar: DetalleOrdenDeTrabajoAInsertar[] = []

  for (const codigo in diccionario) {
    const producto = await getProductosByCodigo(codigo)
    if (!producto) {
      throw new ReferenceError("Producto no encontrado")
    } else {
      const stock = await obtenerStockProducto(codigo)
      const hayStock = stock.some((s) => s.Cantidad > diccionario[codigo])
      if (!hayStock) {
        throw new SyntaxError("Stock insuficiente")
      } else {
        const detalle: DetalleOrdenDeTrabajoAInsertar = {
          Cantidad: diccionario[codigo],
          Descripcion:
            "Producto usado para la orden de trabajo " + ordenDeTrabajo,
          Fecha: hoy,
          Orden_Trabajo: ordenDeTrabajo,
          Producto: codigo,
          SubTotal: producto.Precio * diccionario[codigo],
          Sucursal: detallesOrden[0].Sucursal,
        }

        detallesOrdenAGuardar.push(detalle)
      }
    }
  }

  console.log("Detalles a guardar:", detallesOrdenAGuardar)

  const { data, error } = await supabase
    .from("Consumos Stock")
    .insert(detallesOrdenAGuardar)
    .select()
  if (error) {
    console.log(error)
    throw error
  }

  // for (const codigo in diccionario) {
  //   modificarStockProducto(codigo, -diccionario[codigo])
  // }

  return data as DetalleOrdenDeTrabajoAInsertar[]
}

async function completarOrdenDeTrabajo(id: number) {
  const orden = await getOrdenDeTrabajoById(id)

  if (!orden) {
    throw new ReferenceError("Orden de trabajo no encontrada")
  } else {
    const { data, error } = await supabase
      .from("Ordenes de trabajo")
      .update({ Completada: true })
      .eq("id", id)
      .single()
    if (error) {
      if (error.code === "PGRST116") {
        return null
      }
      throw error
    }
    return data as OrdenDeTrabajo
  }
}

export {
  createOrdenTrabajo,
  getOrdenDeTrabajoById,
  getOrdenesDeTrabajo,
  getOrdenesDeTrabajoActivas,
  obtenerOrdenesDeTrabajoPorFiltros,
  agregarDetallesOrdenDeTrabajo,
  completarOrdenDeTrabajo,
}
