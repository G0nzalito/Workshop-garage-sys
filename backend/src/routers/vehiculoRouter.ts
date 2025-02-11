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

type VehiculoAInsertar = Database["public"]["Tables"]["Vehiculo"]["Insert"]

export const vehiculoRouter = appExpress.Router()

vehiculoRouter.get("/all", async (req, res) => {
  const vehiculos = await getVehiculos()

  res.status(200).json(vehiculos)
})

vehiculoRouter.get("/specific", async (req, res) => {
  const { Patente } = req.body

  const vehiculo = await getVehiculoByPatente(Patente)

  if (vehiculo) {
    res.status(200).json(vehiculo)
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
    const cliente = await getClientByDocument(Tipo_Documento, Numero_Documento)

    await uploadVehiculo(Vehiculo, cliente)

    res.status(203).json({ message: "Vehiculo creado exitosamente" })
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "This Vehicle already exists" })
    }
  }
})
