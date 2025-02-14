import appExpress from "express"
import {
  getProveedores,
  getProveedorById,
  uploadProveedor,
  disableProveedor,
  enableProveedor,
  getProveedorActivo,
  getProveedorByNombre,
} from "../service/proveedoresService"
import { Database } from "../supabase/database.types"

type ProveedorAInsertar = Database["public"]["Tables"]["Proveedores"]["Insert"]
type Proveedor = Database["public"]["Tables"]["Proveedores"]["Row"]

export const proveedoresRouter = appExpress.Router()

proveedoresRouter.get("/all", async (req, res) => {
  const proveedores: Proveedor[] = await getProveedores()

  res.status(200).json(proveedores)
})

proveedoresRouter.get("/specific", async (req, res) => {
  const { id } = req.body

  const proveedor = await getProveedorById(id)

  if (proveedor) {
    res.status(200).json(proveedor)
  } else {
    res.status(404).json({ message: "Proveedor no encontrado" })
  }
})

proveedoresRouter.put("/active", async (req, res) => {
  const proveedores = await getProveedorActivo()

  res.status(200).json(proveedores)
})

proveedoresRouter.post("/create", async (req, res) => {
  const { Nombre } = req.body

  try {
    if (!Nombre) {
      throw new ReferenceError("Nombre es requerido")
    }

    if (await getProveedorByNombre(Nombre)) {
      res.status(400).json({ message: "Proveedor ya existe" })
    }else{
      const nuevoProveedor = await uploadProveedor({ Nombre })
      res.status(201).json(nuevoProveedor)
    }


  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno del sistema", error: e })
    }
  }
})

proveedoresRouter.put("/enable", async (req, res) => {
  const { id } = req.body

  try {
    if (!id) {
      throw new ReferenceError("Id es requerido")
    }

    const proveedor = await getProveedorById(id)

    if (!proveedor) {
      res.status(404).json({ message: "Proveedor no encontrado" })
    }

    const proveedorHabilitado = await enableProveedor(id)

    res.status(200).json(proveedorHabilitado)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno del sistema", error: e })
    }
  }
})

proveedoresRouter.delete("/disable", async (req, res) => {
  const { id } = req.body

  try {
    if (!id) {
      throw new ReferenceError("Id es requerido")
    }

    const proveedor = await getProveedorById(id)

    if (!proveedor) {
      res.status(404).json({ message: "Proveedor no encontrado" })
    }

    const proveedorDeshabilitado = await disableProveedor(id)

    res.status(200).json(proveedorDeshabilitado)
  } catch (e: unknown) {
    if (e instanceof ReferenceError) {
      res.status(400).json({ message: e.message })
    } else {
      res.status(500).json({ message: "Error interno del sistema", error: e })
    }
  }
})
