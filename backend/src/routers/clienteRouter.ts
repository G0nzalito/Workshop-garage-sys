import appExpress from "express"
import {
  getClientes,
  getClientByDocument,
  uploadClient,
  updateClient,
  deleteClient,
} from "../service/clienteService"
import { PostgrestError } from "@supabase/supabase-js"
import { Database } from "../supabase/database.types"

const clientRouter = appExpress.Router()

type ClienteAInsertar = Database["public"]["Tables"]["Cliente"]["Insert"]

clientRouter.get("/all", async (req, res) => {
  const clientes = await getClientes()

  res.status(200).json(clientes)
})

clientRouter.get("/specific", async (req, res) => {
  const { tipoDocumento, numeroDocumento } = req.query

  const cliente = await getClientByDocument(tipoDocumento, numeroDocumento)

  if (!cliente) {
    res.status(404).json({
      message: "Client not found",
    })
  } else {
    res.status(200).json(cliente)
  }
})

clientRouter.post("/create", async (req, res) => {
  try {
    const {
      Nombre,
      Numero_Documento,
      Tipo_Documento,
      Telefono,
      Direccion,
      Email,
      Numero_Socio
    } = req.body

    if (!Nombre || !Numero_Documento) {
      throw new ReferenceError("Name and Document Number are required")
    }

    const clientCreated: ClienteAInsertar[] = await uploadClient({
      Nombre: Nombre,
      Numero_Documento: Numero_Documento,
      Tipo_Documento: Tipo_Documento,
      Telefono: Telefono,
      Direccion: Direccion,
      Email: Email,
      Numero_Socio: Numero_Socio
    })

    res.status(201).json(clientCreated)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({
        message: e.message,
      })
    } else {
      res.status(500).json({
        message: "This client already exists",
      })
    }
  }
})

clientRouter.put("/update", (req, res) => {
  const { Direccion, Email, Telefono, Numero_Documento, Tipo_Documento, Numero_Socio } =
    req.body

  try {
    updateClient(Numero_Documento, Tipo_Documento, {direccion: Direccion, telefono: Telefono, email: Email, numeroSocio: Numero_Socio})
  } catch (e: unknown) {
    res.status(400).json({
      message: "Error",
    })
  }

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
