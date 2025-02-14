import appExpress from "express"
import {
  deleteMarca_de_Productos,
  getMarca_de_ProductosById,
  getMarca_de_Productos,
  uploadMarca_de_Productos,
  enableMarca_de_Productos,
} from "../service/marcaProductosService"
import { Database } from "../supabase/database.types"

type MarcaAInsertar =
  Database["public"]["Tables"]["Marca_de_Productos"]["Insert"]
type Marca = Database["public"]["Tables"]["Marca_de_Productos"]["Row"]

export const marcaProductosRouter = appExpress.Router()

marcaProductosRouter.get("/all", async (req, res) => {
  const marcas = await getMarca_de_Productos()

  res.status(200).json(marcas)
})

marcaProductosRouter.get("/specific", async (req, res) => {
  const { id } = req.body

  const marca = await getMarca_de_ProductosById(id)

  if (marca) {
    res.status(200).json(marca)
  } else {
    res.status(404).json({ message: "Marca no encontrada" })
  }
})

marcaProductosRouter.post("/create", async (req, res) => {
  try {
    const { Nombre } = req.body

    if (!Nombre) {
      throw new ReferenceError("Nombre es requerido")
    }

    const marca: MarcaAInsertar = await uploadMarca_de_Productos({ Nombre })

    res.status(201).json(marca)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error intero del sistema", error: e })
    }
  }
})

marcaProductosRouter.put("/enable", async (req, res) => {
  const { Nombre } = req.body

  try {
    const marca = await enableMarca_de_Productos(Nombre)
    res.status(200).json(marca)
  } catch (e: unknown) {
    res.status(500).json({ message: "Error al habilitar la marca", error: e })
  }
})

marcaProductosRouter.delete("/delete", async (req, res) => {
  const { Nombre } = req.body

  try {
    const marca = await deleteMarca_de_Productos(Nombre)
    res.status(200).json(marca)
  } catch (e: unknown) {
    res.status(500).json({ message: "Error al eliminar la marca", error: e })
  }
})
