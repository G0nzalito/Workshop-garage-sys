import appExpress from "express"
import {
  getClientes,
  getClientByDocument,
  uploadClient,
  updateClient,
  deleteClient,
  getTiposDocumento,
  createTipoDocuemnto,
} from "../service/clienteService"
import { PostgrestError } from "@supabase/supabase-js"
import { Database } from "../supabase/database.types"
import { validateSchemaBody } from "../middlewares/validation"
import { clienteInsertSchema } from "../middlewares/schemas/clienteSchemas"

const clientRouter = appExpress.Router()

type ClienteAInsertar = Database["public"]["Tables"]["Cliente"]["Insert"]
type Cliente = Database["public"]["Tables"]["Cliente"]["Row"]

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

clientRouter.get("/tiposDocumento", async (rqq, res) => {
  try {
    const tiposDocumento = await getTiposDocumento()
    res.status(200).json(tiposDocumento)
  } catch (e: unknown) {
    if (e instanceof PostgrestError) {
      res.status(500).json({
        message: e.message,
      })
    } else {
      res.status(500).json({
        message: "Internal server error",
      })
    }
  }
})

clientRouter.post("/tiposDocumento/create", async (req, res) => {
  try {
    const { Nombre } = req.body

    if (!Nombre) {
      throw new ReferenceError("Nombre is required")
    }

    const tiposDocumento = await getTiposDocumento()
    const existingTipo = tiposDocumento.find(
      (tipo) => tipo.Nombre.toLowerCase() === Nombre.toLowerCase()
    )

    if (existingTipo) {
      throw new ReferenceError("Tipo de documento already exists")
    }

    const nuevoTipo = await createTipoDocuemnto(Nombre)
    res.status(201).json(nuevoTipo)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({
        message: e.message,
      })
    } else {
      res.status(500).json({
        message: e,
      })
    }
  }
})

clientRouter.post(
  "/create",
  validateSchemaBody(clienteInsertSchema),
  async (req, res) => {
    try {
      const {
        Nombre,
        Numero_Documento,
        Tipo_Documento,
        Telefono,
        Direccion,
        Email,
        Asociacion,
      } = req.body

      if (!Nombre || !Numero_Documento) {
        throw new ReferenceError("Name and Document Number are required")
      }

      const existingClient = await getClientByDocument(
        Tipo_Documento,
        Numero_Documento
      )

      if (existingClient) {
        throw new ReferenceError("Client already exists")
      }

      const clientCreated: Cliente = await uploadClient(
        {
          Nombre: Nombre,
          Numero_Documento: Numero_Documento,
          Tipo_Documento: Tipo_Documento,
          Telefono: Telefono,
          Direccion: Direccion,
          Email: Email,
        },
        Asociacion
      )

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
  }
)

clientRouter.put("/update", (req, res) => {
  const {
    Direccion,
    Email,
    Telefono,
    Numero_Documento,
    Tipo_Documento,
    Numero_Socio,
  } = req.body

  try {
    updateClient(Numero_Documento, Tipo_Documento, {
      direccion: Direccion,
      telefono: Telefono,
      email: Email,
      numeroSocio: Numero_Socio,
    })
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
