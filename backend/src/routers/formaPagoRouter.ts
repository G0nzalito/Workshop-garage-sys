import appExpress from 'express'
import { Database } from '../supabase/database.types'
import {getFormaDePagoById, getFormasDePago} from '../service/formaDePagoService'

type FormaDePago = Database["public"]["Tables"]["Medios Pago"]["Row"]

export const formaPagoRouter = appExpress.Router()

formaPagoRouter.get("/all", async (req, res) => {
  const formasPago: FormaDePago[] = await getFormasDePago()

  res.status(200).json(formasPago)
})

formaPagoRouter.get("/specific", async (req, res) => {
  const { id } = req.query

  const formaPago = await getFormaDePagoById(parseInt(id as string))

  if (formaPago) {
    res.status(200).json(formaPago)
  } else {
    res.status(404).json({ message: "Forma de pago no encontrada" })
  }
})