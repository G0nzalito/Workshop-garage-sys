import appExpress from "express"
import { Database } from "../supabase/database.types"
import {
  deleteProductos,
  getProductos,
  getProductosByCodigo,
  updateProductos,
  uploadProductos,
  aumentarStockProducto
} from "../service/productosService"

type ProductoAInsertar = Database["public"]["Tables"]["Productos"]["Insert"]
type Producto = Database["public"]["Tables"]["Productos"]["Row"]

export const productosRouter = appExpress.Router()

productosRouter.get("/all", async (req, res) => {
  try {
    const productos = await getProductos()
    res.status(200).json(productos)
  } catch (error) {
    res.status(500).json({ error })
  }
})

productosRouter.get("/specific", async (req, res) => {
  const { Codigo } = req.body

  if (!Codigo) {
    res.status(400).json({ error: "Codigo is required" })
  } else {
    try {
      const producto = await getProductosByCodigo(Codigo)
      if (producto === null) {
        res.status(404).json({ error: "Producto no encontrado" })
      } else {
        res.status(200).json(producto)
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})

productosRouter.post("/create", async (req, res) => {
  const producto: ProductoAInsertar = req.body

  if (!producto) {
    res.status(400).json({ error: "Todos los datos son requeridos" })
  } else {
    try {
      const productoCreado = await uploadProductos(producto)
      res.status(201).json(productoCreado)
    } catch (error: unknown) {
      if (error instanceof ReferenceError) {
        res.status(400).json({ message: error.message })
      } else {
        res.status(500).json(error)
      }
    }
  }
})

productosRouter.put("/update", async (req, res) => {
  const { Codigo, Descripcion, Precio, PorcentajeAumento, Baja, Proveedor } =
    req.body

  if (!Codigo) {
    res.status(400).json({ error: "Codigo is required" })
  } else {
    try {
      const productoActualizado = await updateProductos(Codigo, {
        Descripcion,
        Precio,
        PorcentajeAumento,
        Baja,
        Proveedor,
      })
      res.status(200).json(productoActualizado)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})

productosRouter.put("/updateStock", async (req, res) => {
  const { Codigo, Cantidad } = req.body

  if (!Codigo || !Cantidad) {
    res.status(400).json({ error: "Codigo and Cantidad are required" })
  } else {
    try {
      const productoActualizado = await aumentarStockProducto(Codigo, Cantidad)
      res.status(200).json(productoActualizado)
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})

productosRouter.delete("/delete", async (req, res) => {
  const { Codigo } = req.body

  if (!Codigo) {
    res.status(400).json({ error: "Codigo is required" })
  } else {
    try {
      await deleteProductos(Codigo)
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})
