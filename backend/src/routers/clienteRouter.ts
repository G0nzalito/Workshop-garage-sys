import appExpress from "express"
import {
  getClientes,
  getClientByDocument,
  uploadClient,
  updateClient,
  deleteClient,
  getTiposDocumento,
  createTipoDocuemnto,
  getClientesFiltrados,
} from "../service/clienteService"
import { PostgrestError } from "@supabase/supabase-js"
import { Database } from "../supabase/database.types"
import {
  validateSchemaBody,
  validateSchemaQuery,
} from "../middlewares/validation"
import {
  clienteInsertSchema,
  clientFilterSchema,
  clientUpdateSchema,
} from "../middlewares/schemas/clienteSchemas"
import { parse } from "dotenv"

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

clientRouter.get(
  "/filter",
  validateSchemaQuery(clientFilterSchema),
  async (req, res) => {
    const { Tipo_Documento, Numero_Documento, Nombre, Numero_Socio } = req.query

    try {
      const clientes = await getClientesFiltrados(
        Tipo_Documento ? parseInt(Tipo_Documento as string) : undefined,
        Numero_Documento ? parseInt(Numero_Documento as string) : undefined,
        Nombre ? (Nombre as string) : undefined,
        Numero_Socio ? parseInt(Numero_Socio as string) : undefined
      )

      res.status(200).json(clientes)
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
  }
)

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
    const { Nombre, TipoCliente } = req.body

    if (!Nombre || !TipoCliente) {
      throw new ReferenceError("Nombre and TipoCliente are required")
    }

    const tiposDocumento = await getTiposDocumento()
    const existingTipo = tiposDocumento.find(
      (tipo) => tipo.Nombre.toLowerCase() === Nombre.toLowerCase()
    )

    if (existingTipo) {
      throw new ReferenceError("Tipo de documento already exists")
    }

    const nuevoTipo = await createTipoDocuemnto(Nombre, TipoCliente)
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

clientRouter.put(
  "/update",
  validateSchemaBody(clientUpdateSchema),
  async (req, res) => {
    const {
      Direccion,
      Email,
      Telefono,
      Numero_Documento,
      Tipo_Documento,
      Asociacion,
      Baja,
    } = req.body

    try {
      const cliente = await getClientByDocument(
        Tipo_Documento,
        Numero_Documento
      )

      if (Baja && !cliente?.Dado_de_baja ) {
        const cliente = await deleteClient(Tipo_Documento, Numero_Documento)
        res.status(200).json(cliente)
      } else {
        const clienteActualizado: Cliente = await updateClient(
          Numero_Documento,
          Tipo_Documento,
          {
            direccion: Direccion,
            telefono: Telefono,
            email: Email,
            asociacion: Asociacion,
          },
          Baja
        )

        res.status(200).json(clienteActualizado)
      }
    } catch (e: unknown) {
      if (e instanceof ReferenceError) {
        res.status(404).json({
          message: e.message,
        })
      } else if (e instanceof PostgrestError) {
        res.status(500).json(e)
      } else {
        res.status(500).json({
          message: "Internal server error",
          error: e,
        })
      }
      res.status(400).json()
    }
  }
)

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
