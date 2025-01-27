import appExpress from "express"
import {
  getClientes,
  getClientByDocument,
  uploadClient,
  updateClient,
  deleteClient,
} from "../service/clienteService"
import { PostgrestError } from "@supabase/supabase-js"

const clientRouter = appExpress.Router()

clientRouter.get("/all", async (req, res) => {
  const clientes = await getClientes()

  res.status(200).json(clientes)
})

clientRouter.get("/specific", async (req, res) => {
  const { tipoDocumento, numeroDocumento } = req.body

  const clientes = await getClientByDocument(tipoDocumento, numeroDocumento)

  if (clientes.length === 0) {
    res.status(404).json({
      message: "Client not found",
    })
  } else {
    res.status(200).json(clientes)
  }
})

clientRouter.post("/create", async (req, res) => {
  try {
    const clientCreated = await uploadClient({
      Nombre: "Juan",
      Numero_Documento: 123,
      Telefono: 12345,
      Tipo_Documento: 1,
    })

    res.status(201).json(clientCreated)
  } catch (e: unknown) {
    res.status(500).json({
      message: "This client already exists",
    })
  }
})

clientRouter.put("/update", (req, res) => {
  updateClient({
    id: 1,
    Nombre: "Juan",
    Numero_Documento: 123,
    Telefono: 1234,
    Tipo_Documento: 1,
  })

  res.status(200).json({
    message: "Client updated",
  })
})

clientRouter.delete("/delete", async (req, res) => {
  const { tipoDocumento, numeroDocumento } = req.body

  try {
    const deletedClient = await deleteClient(tipoDocumento, numeroDocumento)

    res.status(200).json({
      message: "Client deleted",
      client: deletedClient,
    })
  } catch (e: unknown) {
    res.status(404).json({
      message: "Client not found",
    })
  }
})

export default clientRouter
