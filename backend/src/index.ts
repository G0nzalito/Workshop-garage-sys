import cors from "cors"
import dotenv from "dotenv"
import express from "express"
dotenv.config()
import { Request, Response } from "express"

/// Routers

import clientRouter from "./routers/clienteRouter"
import { vehiculoRouter } from "./routers/vehiculoRouter"
import { marcaVehiculoRouter } from "./routers/marcaVehiculoRouter"
import { modeloRouter } from "./routers/modelosRouter"
import { categoriaRouter } from "./routers/categoriaRouter"
import { subCategoriasRouter } from "./routers/subCategoriasRouter"
import { proveedoresRouter } from "./routers/proveedoresRouter"
import { marcaProductosRouter } from "./routers/marcaProductosRouter"
import { productosRouter } from "./routers/productosRouter"
import { ordenDeTrabajoRouter } from "./routers/ordenDeTrabajoRouter"
import { cajaRouter } from "./routers/cajaRouter"
import { cajaContableRouter } from "./routers/cajaContableRouter"
import { gastosRouter } from "./routers/gastosRouter"


const app = express()

const port = process.env.PORT ?? 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use("/api/clientes", clientRouter)
app.use("/api/vehiculos", vehiculoRouter)
app.use("/api/marcasVehiculos", marcaVehiculoRouter)
app.use("/api/modelos", modeloRouter)
app.use("/api/categorias", categoriaRouter)
app.use("/api/subcategorias", subCategoriasRouter)
app.use("/api/proveedores", proveedoresRouter)
app.use("/api/marcasProductos", marcaProductosRouter)
app.use("/api/productos", productosRouter)  
app.use("/api/ordenesDeTrabajo", ordenDeTrabajoRouter)
app.use("/api/ventas", cajaRouter)
app.use("/api/cajaContable", cajaContableRouter)
app.use("/api/gastos", gastosRouter)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permite todos los orígenes
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World",
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
