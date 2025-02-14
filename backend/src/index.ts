import cors from "cors"
import dotenv from "dotenv"
import express from "express"
dotenv.config()
import { Request, Response } from "express"

/// Routers

import clientRouter from "./routers/clienteRouter"
import { vehiculoRouter } from "./routers/vehiculoRouter"
import { marcaRouter } from "./routers/marcaVehiculoRouter"
import { modeloRouter } from "./routers/modelosRouter"
import { categoriaRouter } from "./routers/categoriaRouter"
import { subCategoriasRouter } from "./routers/subCategoriasRouter"
import { proveedoresRouter } from "./routers/proveedoresRouter"


const app = express()

const port = process.env.PORT ?? 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use("/api/clientes", clientRouter)
app.use("/api/vehiculos", vehiculoRouter)
app.use("/api/marcas", marcaRouter)
app.use("/api/modelos", modeloRouter)
app.use("/api/categorias", categoriaRouter)
app.use("/api/subcategorias", subCategoriasRouter)
app.use("/api/proveedores", proveedoresRouter)

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World",
  })
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
