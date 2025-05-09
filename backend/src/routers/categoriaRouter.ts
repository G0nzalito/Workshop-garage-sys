import appExpress from "express"
import {
  getCategoriaActiva,
  getCategoriaByDescripcion,
  getCategoriaById,
  getCategorias,
  uploadCategoria,
} from "../service/categoriasService"
import { Database } from "../supabase/database.types"

type Categoria = Database["public"]["Tables"]["Categorias"]["Row"]

export const categoriaRouter = appExpress.Router()

categoriaRouter.get("/all", async (req, res) => {
  const categorias: Categoria[] = await getCategorias()

  res.status(200).json(categorias)
})

categoriaRouter.get("/active", async (req, res) => {
  const categorias = await getCategoriaActiva()

  res.status(200).json(categorias)
})

categoriaRouter.get("/specific", async (req, res) => {
  const { id } = req.body

  const categoria = await getCategoriaById(id)

  if (categoria) {
    res.status(200).json(categoria)
  } else {
    res.status(404).json({ message: "Categoria no encontrada" })
  }
})

categoriaRouter.post("/create", async (req, res) => {
  try {
    const { Descripcion } = req.body

    if (!Descripcion) {
      throw new ReferenceError("Descripcion es requerido")
    }

    if (await getCategoriaByDescripcion(Descripcion)) {
      res.status(400).json({ message: "Proveedor ya existe" })
    } else {
      const categoria = await uploadCategoria({ Descripcion })
      res.status(201).json(categoria)
    }
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno del sistema", error: e })
    }
  }
})
