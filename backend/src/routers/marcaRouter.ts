import appExpress from "express"
import {
  deleteMarca_de_Vehiculos,
  getMarca_de_VehiculosById,
  getMarca_de_Vehiculos,
  uploadMarca_de_Vehiculos,
  enableMarca_de_vehiculos
} from "../service/marcaService"
import { Database } from "../supabase/database.types"

type MarcaAInsertar = Database["public"]["Tables"]["Marca_de_Vehiculos"]["Insert"]
type Marca = Database["public"]["Tables"]["Marca_de_Vehiculos"]["Row"]

export const marcaRouter = appExpress.Router()

marcaRouter.get("/all", async (req, res) => {
  const marcas = await getMarca_de_Vehiculos()

  res.status(200).json(marcas)
})

marcaRouter.get("/specific", async (req, res) => {
  const { id } = req.body

  const marca = await getMarca_de_VehiculosById(id)

  if (marca) {
    res.status(200).json(marca)
  } else {
    res.status(404).json({ message: "Marca no encontrada" })
  }
})

marcaRouter.post("/create", async (req, res) => {
  try {
    const { Nombre } = req.body

    if (!Nombre) {
      throw new ReferenceError("Nombre es requerido")
    }

    const marca: MarcaAInsertar = await uploadMarca_de_Vehiculos({ Nombre })

    res.status(201).json(marca)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error intero del sistema", error: e })
    }
  }
})

marcaRouter.put("/enable", async (req, res) => {
  const { Nombre } = req.body

  try {
    const marca = await enableMarca_de_vehiculos(Nombre)
    res.status(200).json(marca)
  } catch (e: unknown) {
    res.status(500).json({ message: "Error al habilitar la marca", error: e })
  }
})

marcaRouter.delete("/delete", async (req, res) => {
  const { Nombre } = req.body

  try {
    const marca = await deleteMarca_de_Vehiculos(Nombre)
    res.status(200).json(marca)
  } catch (e: unknown) {
    res.status(500).json({ message: "Error al eliminar la marca", error: e })
  }
})
