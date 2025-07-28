import appExpress from "express"
import {
  getOrdenesDeTrabajoActivas,
  getOrdenDeTrabajoById,
  createOrdenTrabajo,
  agregarDetallesOrdenDeTrabajo,
  completarOrdenDeTrabajo,
} from "../service/ordenDeTrabajoService"
import {
  getDateWithTimeZone,
  formatDateDashARG,
} from "../support/supportFunctions"
import { Database } from "../supabase/database.types"
import { validateSchemaBody } from "../middlewares/validation"
import { ordenDeTrabajoCreateSchema } from "../middlewares/schemas/ordenDeTrabajoSchema"

type OrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Ordenes de trabajo"]["Insert"]
type OrdenDeTrabajo = Database["public"]["Tables"]["Ordenes de trabajo"]["Row"]
type DetalleOrdenDeTrabajoAInsertar =
  Database["public"]["Tables"]["Consumos Stock"]["Insert"]

interface ProductosCantidad {
  codigoProducto: string
  cantidad: number
}

interface DetalleOrdenDeTrabajo {
  OrdenTrabajo: number
  Productos: ProductosCantidad[]
  KilometrosXDia: number
  Descripcion?: string
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

ordenDeTrabajoRouter.post(
  "/create",
  validateSchemaBody(ordenDeTrabajoCreateSchema),
  async (req, res) => {
    const { Tipo_Documento, Numero_Documento, Patente, Razon, Detalles } =
      req.body

    if (!Tipo_Documento || !Numero_Documento || !Patente) {
      res.status(400).json({ error: "Todos los datos son requeridos" })
    } else {
      try {
        const isoLocalString = getDateWithTimeZone(new Date())
        const orden: OrdenDeTrabajoAInsertar = {
          Fecha_creacion: isoLocalString,
          Numero_Documento_Cliente: Numero_Documento,
          Tipo_Documento_Cliente: Tipo_Documento,
          Patente_Vehiculo: Patente,
          Razon: Razon,
        }

        const ordenCreada = await createOrdenTrabajo(orden, Detalles)

        res.status(201).json(ordenCreada)
      } catch (error) {
        if (error instanceof ReferenceError) {
          res.status(400).json({ message: error.message })
        } else {
          res.status(500).json(error)
        }
      }
    }
  }
)

ordenDeTrabajoRouter.post("/addDetail", async (req, res) => {
  const { OrdenTrabajo, Productos, Descripcion }: DetalleOrdenDeTrabajo =
    req.body

  if (!OrdenTrabajo || !Productos) {
    res.status(400).json({ error: "Todos los datos son requeridos" })
  } else {
    try {
      const detallesOrden: DetalleOrdenDeTrabajoAInsertar[] = []
      Productos.forEach((producto) => {
        const detalle: DetalleOrdenDeTrabajoAInsertar = {
          Orden_Trabajo: OrdenTrabajo,
          Producto: producto.codigoProducto,
          Cantidad: producto.cantidad,
          Fecha: getDateWithTimeZone(new Date()),
          SubTotal: 0,
          Descripcion: Descripcion ? Descripcion : "Sin comentarios",
          Sucursal: 1, // Proximo a ser cambiado
        }
        detallesOrden.push(detalle)
      })

      const detallesOrdenCreadas = await agregarDetallesOrdenDeTrabajo(
        detallesOrden,
        OrdenTrabajo
      )

      res
        .status(201)
        .json({ message: "Detalles agregados a orden", detallesOrdenCreadas })
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: error.message })
      } else {
        if (error instanceof SyntaxError) {
          res.status(422).json({ message: error.message })
        } else {
          res.status(500).json(error)
        }
      }
    }
  }
})

ordenDeTrabajoRouter.put("/complete", async (req, res) => {
  const { id } = req.body

  if (!id) {
    res.status(400).json({ error: "Id is required" })
  } else {
    try {
      const ordenCompletada = await completarOrdenDeTrabajo(id)
      res
        .status(200)
        .json({ message: "Orden completada", Orden: ordenCompletada })
    } catch (error: unknown) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json(error)
      }
    }
  }
})
