import appExpress from "express"
import {
  getCuentaGasto,
  getGastos,
  getGastosByCuenta,
  insertGasto,
} from "../service/gastosService"
import { Database } from "../supabase/database.types"
import { convertirFechaLocal } from "../support/supportFunctions"

type Gasto = Database["public"]["Tables"]["Gastos"]["Row"]
type GastoAInsertar = Database["public"]["Tables"]["Gastos"]["Insert"]

export const gastosRouter = appExpress.Router()

gastosRouter.get("/all", async (req, res) => {
  try {
    const gastos = await getGastos()
    res.status(200).json(gastos)
  } catch (error) {
    res.status(500).json(error)
  }
})

gastosRouter.get("/specific", async (req, res) => {
  const { Cuenta } = req.body

  if (!Cuenta) {
    res.status(400).json({ message: "Falta la cuenta" })

    const cuenta = await getCuentaGasto(Cuenta)
    if (!cuenta) {
      throw new ReferenceError("La cuenta no existe")
    } else {
      try {
        const gastos = await getGastosByCuenta(Cuenta)
        res.status(200).json(gastos)
      } catch (error: unknown) {
        if (error instanceof ReferenceError) {
          res.status(404).json({ error: error.message })
        } else {
          res.status(500).json(error)
        }
      }
    }
  }
})

gastosRouter.post("/create", async (req, res) => {
  const { Turno, Cuenta, Monto, Observaciones, Comprobante, Sucursal_id } =
    req.body

  console.log("Hola")

  if (!Turno || !Cuenta || !Monto || !Sucursal_id) {
    res.status(400).json({ message: "Faltan datos" })
  } else {
    try {
      const cuenta = await getCuentaGasto(Cuenta)
      if (!cuenta) {
        throw new ReferenceError("La cuenta no existe")
      } else {
        if (Cuenta === 3) {
          if (!Observaciones) {
            res.status(400).json({ message: "Falta la observación" })
            return
          }
        }
        const gasto: GastoAInsertar = {
          Turno,
          Cuenta,
          Monto,
          Observaciones: Observaciones
            ? Observaciones
            : "Sin Observaciones extra",
          Comprobante,
          Fecha: convertirFechaLocal(new Date()),
          Sucursal_id,
        }

        await insertGasto(gasto)
        res.status(201).json({ message: "Gasto creado" })
      }
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json(error)
      }
    }
  }
})
