import { z } from "zod"

export const consumoCreateSchema = z.object({
  Producto: z.string().min(1, "El producto es requerido"),
  SubTotal: z
    .number()
    .min(0, "El subtotal debe ser un número no negativo"),
  OrdenTrabajo: z.number().int().optional(),
  Cantidad: z.number().int().optional(),
  Descripcion: z.string().optional(),
})
