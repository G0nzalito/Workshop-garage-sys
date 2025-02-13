import appExpress from "express"
import {
  deleteModelo,
  getModeloById,
  getModeloByNombre,
  getModelos,
  getModelosDeMarca,
  uploadModelo,
} from "../service/modelosService"
import { Database } from "../supabase/database.types"
import { getMarca_de_VehiculosByNombre } from "../service/marcaVehiculoService"

export const modeloRouter = appExpress.Router()

type ModeloAInsertar = Database["public"]["Tables"]["Modelos"]["Insert"]
type Modelo = Database["public"]["Tables"]["Modelos"]["Row"]

modeloRouter.get("/all", async (req, res) => {
  const modelos = await getModelos()

  res.status(200).json(modelos)
})

modeloRouter.get("/specific", async (req, res) => {
  const { Id, Nombre } = req.body

  if (Id !== null) {
    const modelo = await getModeloById(Id)

    if (modelo) {
      res.status(200).json(modelo)
    } else {
      res.status(404).json({ message: "Modelo no encontrado" })
    }
  } else if (Nombre !== null) {
    const modelo = await getModeloByNombre(Nombre)

    if (modelo) {
      res.status(200).json(modelo)
    } else {
      res.status(404).json({ message: "Modelo no encontrado" })
    }
  } else {
    res.status(400).json({ message: "Información suficiente no brindada" })
  }
})

modeloRouter.get("/marca", async (req, res) => {
  const { nombre } = req.query

  if (nombre !== null) {
    try {
      const Marca = await getMarca_de_VehiculosByNombre(nombre as string)

      if (Marca.Dada_de_baja === false) {
        const modelos = await getModelosDeMarca(Marca.id)

        if (modelos.length > 0) {
          res.status(200).json(modelos)
        } else {
          res.status(404).json({ message: "Modelo no encontrado" })
        }
      } else {
        res.status(406).json({ message: "Marca dada de baja" })
      }
    } catch (e: unknown) {
      res.status(404).json({ message: "Marca no encontrada" })
    }
  } else {
    res.status(400).json({ message: "Información suficiente no brindada" })
  }
})

modeloRouter.post("/create", async (req, res) => {
  try {
    const { Nombre, Marca } = req.body

    if (!Nombre || !Marca) {
      throw new ReferenceError("Todos los campos son requeridos")
    }

    const Modelo: ModeloAInsertar = {
      Nombre: Nombre,
      Marca: Marca,
    }

    const modelo = await uploadModelo(Modelo)

    res.status(201).json({ message: "Modelo creado", modelo: modelo })
  } catch (e: unknown) {
    console.log(e)
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno" })
    }
  }
})

modeloRouter.delete("/delete", async (req, res) => {
  const { Id } = req.body

  if (Id !== null) {
    const modelo = await getModeloById(Id)

    if (modelo) {
      const modelo = await deleteModelo(Id)
      res.status(200).json({ message: "Modelo eliminado", modelo: modelo })
    } else {
      res.status(404).json({ message: "Modelo no encontrado" })
    }
  } else {
    res.status(400).json({ message: "Información suficiente no brindada" })
  }
})
