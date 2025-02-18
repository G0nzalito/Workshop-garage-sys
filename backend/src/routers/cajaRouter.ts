import appExpress from "express"
import {
  getCaja,
  getCajaDesdeFecha,
  registrarVenta,
} from "../service/cajaService"
import { getFormaDePagoById } from "../service/formaDePagoService"
import { Database } from "../supabase/database.types"
import { convertirFechaLocal } from "../support/supportFunctions"

type Caja = Database["public"]["Tables"]["Caja"]["Row"]
type CajaAInsertar = Database["public"]["Tables"]["Caja"]["Insert"]

export const cajaRouter = appExpress.Router()

cajaRouter.get("/all", async (req, res) => {
  const cajas: Caja[] = await getCaja()

  res.status(200).json(cajas)
})

cajaRouter.get("/specific", async (req, res) => {
  const { fechaMinima, fechaMaxima } = req.body

  const caja = await getCajaDesdeFecha(fechaMinima, fechaMaxima)

  if (caja) {
    res.status(200).json(caja)
  } else {
    res.status(404).json({ message: "Caja no encontrada" })
  }
})

cajaRouter.post("/create", async (req, res) => {
  try {
    const venta: CajaAInsertar = req.body

    if (
      venta.Forma_de_Pago === undefined ||
      venta.Fuente_MKT === undefined ||
      venta.Numero_Documento_Cliente === undefined ||
      venta.Tipo_Documento_Cliente === undefined ||
      venta.Sub_Total === undefined ||
      venta.Turno === undefined
    ) {
      throw new ReferenceError("Faltan datos de la venta")
    }

    if (venta.Forma_de_Pago === 2 || venta.Forma_de_Pago === 3) { 
      if(venta.N_Autorizacion === undefined || venta.N_Cupon === undefined || venta.N_Lote === undefined) {
        throw new ReferenceError("Faltan datos para la venta con tarjeta")
      }
    }

    venta.Fecha = convertirFechaLocal(new Date())

    const caja = await registrarVenta(venta)

    res.status(201).json(caja)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno del sistema", error: e })
    }
  }
})
