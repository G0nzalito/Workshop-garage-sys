import appExpress, { Request } from "express"
import { Database } from "../supabase/database.types"
import {
  deleteProductos,
  getProductos,
  getProductosByCodigo,
  updateProductos,
  uploadProductos,
  modificarStockProducto,
  getProductosFiltrados,
  obtenerStockProducto,
  guardarStockSucursal,
  aumentarPrecioPorCatYSCat,
} from "../service/productosService"
import { getSucursalById } from "../service/sucursalService"

type ProductoAInsertar = Database["public"]["Tables"]["Productos"]["Insert"]
type Producto = Database["public"]["Tables"]["Productos"]["Row"]
type StockAInsertar = Database["public"]["Tables"]["Stock"]["Insert"]

export const productosRouter = appExpress.Router()

type ProductoStock = {
  Codigo: string
  Cantidad: number
}

productosRouter.get("/all", async (req, res) => {
  try {
    const productos = await getProductos()
    res.status(200).json(productos)
  } catch (error) {
    res.status(500).json({ error })
  }
})

productosRouter.get("/filter", async (req, res) => {
  try {
    const { Descripcion, Categoria, SubCategoria, Marca, Proveedor } = req.query

    const descripcion = Descripcion ? (Descripcion as string) : ""
    const categoria = Categoria ? parseInt(Categoria as string) : 0
    const subCategoria = SubCategoria ? parseInt(SubCategoria as string) : 0
    const marca = Marca ? parseInt(Marca as string) : 0
    const proveedor = Proveedor ? parseInt(Proveedor as string) : 0

    const productos = await getProductosFiltrados(
      descripcion,
      categoria,
      subCategoria,
      marca,
      proveedor
    )

    console.log("Productos", productos)

    res.status(200).json(productos)
  } catch (error) {
    res.status(500).json({ error })
  }
})

productosRouter.get("/specific", async (req: Request, res) => {
  const { Codigo } = req.query

  if (!Codigo) {
    res.status(400).json({ error: "Codigo is required" })
  } else {
    try {
      const producto = await getProductosByCodigo(Codigo as string)
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

productosRouter.get("/hayStock", async (req, res) => {
  const { Codigo, Cantidad, Sucursal_id } = req.query

  const producto = await getProductosByCodigo(Codigo as string)
  if (!producto) {
    console.log("encontre este error")
    res.status(404).json({ error: "Producto no encontrado" })
  } else {
    const stock = (
      await obtenerStockProducto(
        Codigo as string,
        parseInt(Sucursal_id as string)
      )
    )[0]
    if (stock.Cantidad >= parseFloat(Cantidad as string)) {
      res.status(200).json({ message: "Hay stock suficiente" })
    } else {
      res.status(400).json({ error: "No hay stock suficiente" })
    }
  }
})

productosRouter.get("/stock", async (req, res) => {
  const { Codigo, Sucursal_id } = req.query

  console.log("Query", req.query)

  try {
    const producto = await getProductosByCodigo(Codigo as string)
    if (!producto) {
      throw new ReferenceError("Producto no encontrado")
    }

    console.log("sucursal id", Sucursal_id as string)

    if (!Sucursal_id) {
      throw new ReferenceError("Sucursal no encontrada")
    }
    const sucursal_id = getSucursalById(parseInt(Sucursal_id as string))

    const stock = await obtenerStockProducto(
      Codigo as string,
      parseInt(Sucursal_id as string)
    )

    res.status(200).json(stock)
  } catch (error) {
    if (error instanceof ReferenceError) {
      res.status(404).json({ error: error.message })
    } else {
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
      producto.SubCategoria === 0 ? (producto.SubCategoria = null) : null
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

productosRouter.post("/uploadStock", async (req, res) => {
  const nuevoStock: StockAInsertar = req.body

  if (!nuevoStock.Codigo || !nuevoStock.Sucursal_id) {
    res.status(400).json({ error: "Codigo y Sucursal son requeridos" })
  }

  if (!nuevoStock.Cantidad) {
    nuevoStock.Cantidad = 0
  }

  try {
    const stock = await guardarStockSucursal(nuevoStock)

    res.status(201).json(stock)
  } catch (error) {
    res.status(500).json(error)
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

productosRouter.put("/updatePrecioCategoria", async (req, res) => {
  const { Categoria, SubCategoria, Porcentaje } = req.body

  console.log(req.body.SubCategoria)

  if (!Categoria || !Porcentaje) {
    res.status(400).json({ error: "Categoria y Porcentaje son requeridos" })
  } else {
    try {
      await aumentarPrecioPorCatYSCat(
        Categoria,
        Porcentaje,
        parseInt(SubCategoria)
      )
      res.status(200).json("Productos Actualizados con éxito")
    } catch (error) {
      if (error instanceof ReferenceError) {
        res.status(400).json(error)
      } else {
        res.status(500).json(error)
      }
    }
  }
})

productosRouter.put("/updateStock", async (req, res) => {
  const {
    Productos,
    Sucursal_id,
  }: { Productos: ProductoStock[]; Sucursal_id: number } = req.body

  if (Productos.length === 0) {
    res.status(400).json({ error: "No fueron enviados productos" })
  } else {
    try {
      Productos.forEach(async (producto) => {
        // console.log("producto", producto)
        await modificarStockProducto(
          producto.Codigo,
          producto.Cantidad,
          Sucursal_id
        )
      })
      res.status(200).json("Los productos fueron actualizados con exito")
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})

productosRouter.delete("/delete", async (req, res) => {
  const { Codigo } = req.query

  if (!Codigo) {
    res.status(400).json({ error: "Codigo is required" })
  } else {
    try {
      await deleteProductos(Codigo as string)
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error })
    }
  }
})
