import appExpress from "express"
import {
  asignarVehiculoACliente,
  getDueñoByPatente,
  getVehiculoByPatente,
  getVehiculos,
  getVehiculosByFiltros,
  uploadVehiculo,
  upodateKilometersOfVehiculo,
} from "../service/vehiculoService"
import { getClientByDocument } from "../service/clienteService"
import { Database } from "../supabase/database.types"
import { getModeloById } from "../service/modelosService"
import { getMarca_de_VehiculosById } from "../service/marcaVehiculoService"
import { z, ZodError } from "zod"
import {
  validateSchemaBody,
  validateSchemaQuery,
} from "../middlewares/validation"
import {
  vehiculoCreateSchema,
  vehiculoFilterSchema,
  vehiculoUpdateSchema,
} from "../middlewares/schemas/vehiculoSchemas"
import { convertirFechaLocal } from "../support/supportFunctions"

type VehiculoAInsertar = Database["public"]["Tables"]["Vehiculo"]["Insert"]
type Vehiculo = Database["public"]["Tables"]["Vehiculo"]["Row"]
type Cliente = Database["public"]["Tables"]["Cliente"]["Row"]
type VehiculoAMostrar = Omit<Vehiculo, "Marca" | "Modelo" | "Cliente"> & {
  Marca: string
  Modelo: string
  Cliente: string
}

export const vehiculoRouter = appExpress.Router()

async function cargarVehiculosAMostrar(vehiculos: Vehiculo[]) {
  let vehiculosAMostrar: VehiculoAMostrar[] = []

  for (const vehiculo of vehiculos) {
    //@ts-expect-error Siempre va a existir la marca de un vehiculo
    const nombreMarca = (await getMarca_de_VehiculosById(vehiculo.Marca)).Nombre
    //@ts-expect-error Siempre va a existir el modelo de un vehiculo
    const nombreModelo = (await getModeloById(vehiculo.Modelo)).Nombre

    const dueño = await getDueñoByPatente(vehiculo.Patente)

    const { Marca, Modelo, ...resto } = vehiculo

    const vehiculoAMostrar: VehiculoAMostrar = {
      Marca: nombreMarca,
      Modelo: nombreModelo,
      Cliente: dueño
        ? `${dueño.Tipo_Documento_Cliente}-${dueño.Numero_Documento_Cliente}`
        : "Sin dueño",
      ...resto,
    }
    vehiculosAMostrar.push(vehiculoAMostrar)
  }
  return vehiculosAMostrar
}

vehiculoRouter.get("/all", async (req, res) => {
  const vehiculos = await getVehiculos()

  const vehiculosAMostrar = await cargarVehiculosAMostrar(vehiculos)

  res.status(200).json(vehiculosAMostrar)
})

vehiculoRouter.get("/specific", async (req, res) => {
  const { Patente } = req.query

  const vehiculo = await getVehiculoByPatente(Patente as string)

  if (vehiculo) {
    const vehiculoAMostrar = await cargarVehiculosAMostrar([vehiculo])
    res.status(200).json(vehiculoAMostrar)
  } else {
    res.status(404).json({ message: "Patente no encontrada" })
  }
})

vehiculoRouter.get(
  "/filter",
  validateSchemaQuery(vehiculoFilterSchema),
  async (req, res) => {
    const { Marca, Modelo, Motor, Tipo_Documento, Numero_Documento } = req.query

    try {
      const vehiculos = await getVehiculosByFiltros(
        Marca ? parseInt(Marca as string) : undefined,
        Modelo ? parseInt(Modelo as string) : undefined,
        Motor ? (Motor as string) : undefined,
        Numero_Documento ? parseInt(Numero_Documento as string) : undefined,
        Tipo_Documento ? parseInt(Tipo_Documento as string) : undefined
      )

      const vehiculosAMostrar = await cargarVehiculosAMostrar(vehiculos)

      res.status(200).json(vehiculosAMostrar)
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        res.status(400).json({ message: e.message })
      } else if (e instanceof ReferenceError) {
        res.status(400).json({ message: e.message })
      } else {
        res.status(500).json({ message: "Interal server error", e: e })
      }
    }
  }
)

vehiculoRouter.post(
  "/create",
  validateSchemaBody(vehiculoCreateSchema),
  async (req, res) => {
    try {
      const {
        vehiculo,
        dueño,
      }: {
        vehiculo: VehiculoAInsertar
        dueño: { Tipo_Documento: number; Numero_Documento: number }
      } = req.body

      if (await getVehiculoByPatente(vehiculo.Patente)) {
        throw new ReferenceError("Patente Duplicada")
      }

      const modelo = await getModeloById(vehiculo.Modelo)

      if (!modelo) {
        throw new ReferenceError("Modelo no encontrado")
      }

      if (modelo.Marca !== vehiculo.Marca) {
        throw new ReferenceError("El modelo no corresponde a la marca")
      }

      const cliente = await getClientByDocument(
        dueño.Tipo_Documento,
        dueño.Numero_Documento
      )

      if (!cliente) {
        throw new ReferenceError("Cliente no encontrado")
      }

      await uploadVehiculo(vehiculo, cliente)

      res.status(201).json({ message: "Vehiculo creado exitosamente" })
    } catch (e: unknown) {
      if (e instanceof ReferenceError) {
        res.status(400).json({ message: e.message })
      } else {
        res.status(500).json({ message: "Interal server error", e: e })
      }
    }
  }
)

vehiculoRouter.put(
  "/update",
  validateSchemaBody(vehiculoUpdateSchema),
  async (req, res) => {
    const { Patente, Kilometros, Dueño } = req.body

    console.log("Dueño", Dueño)
    console.log("Patente", Patente)


    if (Patente) {
      const cambios = {}
      try {
        if (Dueño) {
          const today = new Date()
          const todayString = convertirFechaLocal(today)
          const nuevoDueño = await asignarVehiculoACliente(
            Patente,
            Dueño.Tipo_Documento,
            Dueño.Numero_Documento,
            todayString
          )
          cambios[
            "Dueño"
            //@ts-expect-error
          ] = `${nuevoDueño.Tipo_Documento_Cliente}-${nuevoDueño.Numero_Documento_Cliente}`
        }

        if (Kilometros) {
          const nuevoKilometraje = (
            await upodateKilometersOfVehiculo(Patente, Kilometros)
          ).Kilometros
          cambios["Kilometros"] = nuevoKilometraje
        }

        res.status(200).json({ message: "Vehiculo actualizados", cambios })
      } catch (e: unknown) {
        res
          .status(500)
          .json({ message: "Error al actualizar el vehiculo", e })
      }
    } else {
      res.status(400).json({ message: "Información suficiente no brindada" })
    }
  }
)
