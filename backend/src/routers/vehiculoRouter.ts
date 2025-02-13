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

type VehiculoAInsertar = Database["public"]["Tables"]["Vehiculo"]["Insert"]
type Vehiculo = Database["public"]["Tables"]["Vehiculo"]["Row"]
type VehiculoAMostrar = Omit<Vehiculo, "Marca" | "Modelo"> & {
  Marca: string
  Modelo: string
}

export const vehiculoRouter = appExpress.Router()

async function cargarVehiculosAMostrar(vehiculos: Vehiculo[]) {
  let vehiculosAMostrar: VehiculoAMostrar[] = []

  for (const vehiculo of vehiculos) {
    const nombreMarca = (await getMarca_de_VehiculosById(vehiculo.Marca)).Nombre
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

vehiculoRouter.post("/create", async (req, res) => {
  try {
    const {
      Patente,
      Marca,
      Modelo,
      Año,
      Kilometros,
      Motor,
      Numero_Documento,
      Tipo_Documento,
    } = req.body

    if (
      !Patente ||
      !Marca ||
      !Modelo ||
      !Año ||
      !Kilometros ||
      !Motor ||
      !Numero_Documento ||
      !Tipo_Documento
    ) {
      throw new ReferenceError("Todos los campos son requeridos")
    }

    const Vehiculo: VehiculoAInsertar = {
      Patente: Patente,
      Marca: Marca,
      Modelo: Modelo,
      Año: Año,
      Kilometros: Kilometros,
      Motor: Motor,
    }

    const modelo = await getModeloById(Modelo)

    if (modelo.Marca !== Marca) {
      throw new ReferenceError("El modelo no corresponde a la marca")
    }

    const cliente = await getClientByDocument(Tipo_Documento, Numero_Documento)

    await uploadVehiculo(Vehiculo, cliente)

    res.status(201).json({ message: "Vehiculo creado exitosamente" })
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Interal server error", e: e })
    }
  }
})

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
