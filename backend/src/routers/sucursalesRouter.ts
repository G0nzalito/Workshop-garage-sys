import appExpress from "express"
import { getSucursales } from "../service/sucursalService"

export const sucursalesRouter = appExpress.Router()

sucursalesRouter.get("/all", async (req, res) => {
  const sucursales = await getSucursales()
  res.status(200).json(sucursales)
})
