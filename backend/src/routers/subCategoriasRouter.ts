import appExpress from "express"
import {
  getSubCategorias,
  getSubCategoriaById,
  uploadSubCategoria,
  getSubCategoriaByCategoria,
  getSubCategoriasActivas,
} from "../service/subCategoriasService"
import { Database } from "../supabase/database.types"

export const subCategoriasRouter = appExpress.Router()

type SubCategoriaAInsertar =
  Database["public"]["Tables"]["SubCategorias"]["Insert"]
type SubCategoria = Database["public"]["Tables"]["SubCategorias"]["Row"]

subCategoriasRouter.get("/all", async (req, res) => {
  const subCategorias: SubCategoria[] = await getSubCategorias()

  res.status(200).json(subCategorias)
})

subCategoriasRouter.get("/active", async (req, res) => {
  const subCategorias: SubCategoria[] = await getSubCategoriasActivas()

  res.status(200).json(subCategorias)
})

subCategoriasRouter.get("/specific", async (req, res) => {
  const { id, Categoria } = req.query

  if (id) {
    const subCategoria = await getSubCategoriaById(parseInt(id as string))
    if (subCategoria) {
      res.status(200).json(subCategoria)
    } else {
      res.status(404).json({ message: "SubCategoria no encontrada" })
    }
  } else {
    if (Categoria) {
      const subCategoria = await getSubCategoriaByCategoria(
        parseInt(Categoria as string)
      )
      if (subCategoria) {
        res.status(200).json(subCategoria)
      } else {
        res.status(404).json({ message: "SubCategoria no encontrada" })
      }
    } else {
      res.status(400).json({ message: "Id o Categoria es requerido" })
    }
  }
})

subCategoriasRouter.post("/create", async (req, res) => {
  try {
    const { Descripcion, Categoria } = req.body

    if (!Descripcion) {
      throw new ReferenceError("Descripcion es requerido")
    }

    if (!Categoria) {
      throw new ReferenceError("Categoria es requerido")
    }

    const subCategorias = await getSubCategoriaByCategoria(Categoria)

    if (subCategorias.includes(Descripcion)) {
      res.status(400).json({ message: "SubCategoria ya existe" })
    } else {
      const nuevaSubCategoria: SubCategoriaAInsertar = {
        Descripcion: Descripcion,
        Categoria: Categoria,
      }

      const subCategoria = await uploadSubCategoria(nuevaSubCategoria)

      res.status(201).json(subCategoria)
    }
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno del sistema", error: e })
    }
  }
})
