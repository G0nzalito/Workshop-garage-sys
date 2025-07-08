import appExpress from "express"
import {
  asignarVehiculoACliente,
  getVehiculoByPatente,
  getVehiculos,
  uploadVehiculo,
  upodateKilometersOfVehiculo,
} from "../service/vehiculoService"
import { getClientByDocument } from "../service/clienteService"
import { Database } from "../supabase/database.types"
import { getModeloById } from "../service/modelosService"
import { getMarca_de_VehiculosById } from "../service/marcaVehiculoService"
import { z, ZodError } from "zod"
import { validateSchema } from "../middlewares/validation"
import { vehiculoCreateSchema } from "../middlewares/schemas/vehiculoSchemas"

type VehiculoAInsertar = Database["public"]["Tables"]["Vehiculo"]["Insert"]
type Vehiculo = Database["public"]["Tables"]["Vehiculo"]["Row"]
type Cliente = Database["public"]["Tables"]["Cliente"]["Row"]
type VehiculoAMostrar = Omit<Vehiculo, "Marca" | "Modelo"> & {
  Marca: string
  Modelo: string
}

export const vehiculoRouter = appExpress.Router()

async function cargarVehiculosAMostrar(vehiculos: Vehiculo[]) {
  let vehiculosAMostrar: VehiculoAMostrar[] = []

  for (const vehiculo of vehiculos) {
    //@ts-expect-error Siempre va a existir la marca de un vehiculo
    const nombreMarca = (await getMarca_de_VehiculosById(vehiculo.Marca)).Nombre
    //@ts-expect-error Siempre va a existir el modelo de un vehiculo
    const nombreModelo = (await getModeloById(vehiculo.Modelo)).Nombre

    const { Marca, Modelo, ...resto } = vehiculo

    const vehiculoAMostrar: VehiculoAMostrar = {
      Marca: nombreMarca,
      Modelo: nombreModelo,
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
  const { Patente } = req.body

  const vehiculo = await getVehiculoByPatente(Patente)

  if (vehiculo) {
    const vehiculoAMostrar = await cargarVehiculosAMostrar([vehiculo])
    res.status(200).json(vehiculoAMostrar)
  } else {
    res.status(404).json({ message: "Patente no encontrada" })
  }
})

vehiculoRouter.post(
  "/create",
  validateSchema(vehiculoCreateSchema),
  async (req, res) => {
    try {
      const {
        vehiculo,
        dueño,
      }: { vehiculo: VehiculoAInsertar; dueño: Cliente } = req.body

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

vehiculoRouter.put("/updateKilometers", async (req, res) => {
  const { Patente, Kilometros } = req.body

  if (Patente && Kilometros) {
    try {
      await upodateKilometersOfVehiculo(Patente, { kilometros: Kilometros })

      res.status(200).json({ message: "Kilometros actualizados" })
    } catch (e: unknown) {
      res
        .status(500)
        .json({ message: "Error al actualizar los kilometros", error: e })
    }
  } else {
    res.status(400).json({ message: "Información suficiente no brindada" })
  }
})
