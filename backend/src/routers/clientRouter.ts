import appExpress from "express"
import { uploadClient } from "../service/clienteService"

const clientRouter = appExpress.Router()

clientRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello World",
  })
})

clientRouter.post("/", (req, res) => {
  uploadClient({
    Nombre: "Juan",
    Numero_Documento: 123,
    Telefono: 123,
    Tipo_Documento: 1,
  })

  res.status(201).json({
    message: "Client created",
  })
})

export default clientRouter
