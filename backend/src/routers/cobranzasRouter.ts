import appExpress from "express"
import {
  getCobros,
  getCobrosDesdeFecha,
  registrarCobros,
} from "../service/cobranzasService"
import { getFormaDePagoById } from "../service/formaDePagoService"
import { Database } from "../supabase/database.types"
import { convertirFechaLocal } from "../support/supportFunctions"

type Cobranza = Database["public"]["Tables"]["Cobranzas"]["Row"]
type CobranzaAInsertar = Database["public"]["Tables"]["Cobranzas"]["Insert"]

export const cajaRouter = appExpress.Router()

cajaRouter.get("/all", async (req, res) => {
  const cajas: Cobranza[] = await getCobros()

  res.status(200).json(cajas)
})

cajaRouter.get("/specific", async (req, res) => {
  const { fechaMinima, fechaMaxima } = req.body

  const cobros = await getCobrosDesdeFecha(fechaMinima, fechaMaxima)

  if (cobros) {
    res.status(200).json(cobros)
  } else {
    res.status(404).json({ message: "Caja no encontrada" })
  }
})

cajaRouter.post("/create", async (req, res) => {
  try {
    const cobro: CobranzaAInsertar = req.body
    const {Sucursal_id} = req.body

    if (
      cobro.Forma_de_Pago === undefined ||
      cobro.Numero_Documento_Cliente === undefined ||
      cobro.Tipo_Documento_Cliente === undefined ||
      cobro.Monto === undefined ||
      cobro.Turno === undefined 
    ) {
      throw new ReferenceError("Faltan datos de la venta")
    }

    if (cobro.Forma_de_Pago === 2 || cobro.Forma_de_Pago === 3) {
      if (
        cobro.Autorizacion === undefined ||
        cobro.Cupon === undefined ||
        cobro.Lote === undefined
      ) {
        throw new ReferenceError("Faltan datos para la venta con tarjeta")
      }
    }

    cobro.Fecha = convertirFechaLocal(new Date())

    const caja = await registrarCobros(cobro, Sucursal_id)

    res.status(201).json(caja)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno del sistema", error: e })
    }
  }
})
