import appExpress from "express"
import {
  getOrdenesDeTrabajoActivas,
  getOrdenDeTrabajoById,
  createOrdenTrabajo,
} from "../service/ordenDeTrabajoService"
import { Database } from "../supabase/database.types"

type OrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Ordenes de trabajo"]["Insert"]
type OrdenDeTrabajo = Database["public"]["Tables"]["Ordenes de trabajo"]["Row"]
type DetalleOrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Detalle Ordenes de Trabajo"]["Insert"]

interface ProductosCantidad {
  codigoProducto: string
  cantidad: number
}

interface DetalleOrdenDeTrabajo {
  OrdenTrabajo: number
  Productos: ProductosCantidad[]
}

export const ordenDeTrabajoRouter = appExpress.Router()

ordenDeTrabajoRouter.get("/all", async (req, res) => {
  try {
    const ordenes = await getOrdenesDeTrabajoActivas()
    res.status(200).json(ordenes)
  } catch (error) {
    res.status(500).json({ error })
  }
})

ordenDeTrabajoRouter.get("/specific", async (req, res) => {
  const { id } = req.body

  if (!id) {
    res.status(400).json({ error: "Id is required" })
  } else {
    try {
      const orden = await getOrdenDeTrabajoById(id)
      res.status(200).json(orden)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})

ordenDeTrabajoRouter.post("/create", async (req, res) => {
  const { Tipo_Documento, Numero_Documento, Patente } = req.body

  if (!Tipo_Documento || !Numero_Documento || !Patente) {
    res.status(400).json({ error: "Todos los datos son requeridos" })
  } else {
    try {
      const fechaCreacion = new Date()
      const orden: OrdenDeTrabajoAInsertar = {
        Fecha_creacion: fechaCreacion.toLocaleDateString(),
        Numero_Documento_Cliente: Numero_Documento,
        Tipo_Documento_Cliente: Tipo_Documento,
        Patente_Vehiculo: Patente,
      }

      const ordenCreada = await createOrdenTrabajo(orden)

      res.status(201).json(ordenCreada)
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json(error)
      }
    }
  }
})

ordenDeTrabajoRouter.post("/addDetail", async (req, res) => {
  const { OrdenTrabajo, Productos }: DetalleOrdenDeTrabajo = req.body

  if (!OrdenTrabajo || !Productos) {
    res.status(400).json({ error: "Todos los datos son requeridos" })
  } else {
    try {
      // const detalle: DetalleOrdenDeTrabajoAInsertar = {
      //   OrdenTrabajo: id,
      //   Producto,
      //   Cantidad
      // }

      const detallesOrden: DetalleOrdenDeTrabajoAInsertar[] = []
      Productos.forEach((producto) => {
        const detalle: DetalleOrdenDeTrabajoAInsertar = {
          OrdenTrabajo: OrdenTrabajo,
          Producto: producto.codigoProducto,
          Cantidad: producto.cantidad,
        }
        detallesOrden.push(detalle)
      })

      res.status(201).json(detallesOrden)
    } catch (error) {
      res.status(500).json(error)
    }
  }
})
