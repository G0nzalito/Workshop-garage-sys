import appExpress from "express"
import {
  createAsientoContable,
  getAsientosContables,
  getAsientosContablesDesdeFecha,
  getConcepto,
} from "../service/cajaContableService"
import { Database } from "../supabase/database.types"
import { convertirFechaLocal } from "../support/supportFunctions"

type AsientoContable = Database["public"]["Tables"]["Caja Contable"]["Row"]
type AsientoContableAInsertar =
  Database["public"]["Tables"]["Caja Contable"]["Insert"]
type Concepto = Database["public"]["Tables"]["Conceptos Caja Contable"]["Row"]

export const cajaContableRouter = appExpress.Router()

cajaContableRouter.get("/all", async (req, res) => {
  try {
    const asientos = await getAsientosContables()
    res.status(200).json(asientos)
  } catch (error) {
    res.status(500).json({ error })
  }
})

cajaContableRouter.get("/specific", async (req, res) => {
  const { fechaMinima } = req.body

  if (!fechaMinima) {
    res.status(400).json({ message: "Falta la fecha mínima" })
  } else {
    try {
      const asientos = await getAsientosContablesDesdeFecha(fechaMinima)
      res.status(200).json(asientos)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})

cajaContableRouter.post("/create", async (req, res) => {
  const { Monto, Movimiento, Turno, Detalle } = req.body

  if (!Monto || Monto < 0 || !Movimiento || !Turno) {
    res.status(400).json({ message: "Faltan datos" })
  } else {
    try {
      const movimiento = await getConcepto(Movimiento)

      if (!movimiento) {
        throw new ReferenceError("El concepto no existe")
      } else {
        if (
          (movimiento.Nombre === "Gasto" || movimiento.Nombre === "Retiro") &&
          !Detalle
        ) {
          throw new ReferenceError(
            "Para anotar un gasto o retiro es necesario especificar el detalle"
          )
        }
      }

      const asiento: AsientoContableAInsertar = {
        Monto,
        Movimiento,
        Turno,
        Detalle: Detalle ? Detalle : "Sin comentarios extra",
        Fecha: convertirFechaLocal(new Date()),
      }
      await createAsientoContable(asiento)
      res.status(201).json({ message: "Asiento creado" })
    } catch (error: unknown) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json({ message: "Error interno del sistema", error })
      }
    }
  }
})
