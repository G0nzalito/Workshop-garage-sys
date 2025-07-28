import { z } from "zod"
import { consumoCreateSchema } from "./consumosStockSchema"

export const ordenDeTrabajoCreateSchema = z.object({
  Tipo_Documento: z.number().min(1, "El tipo de documento es requerido"),
  Numero_Documento: z.number().min(1, "El numero de documento es requerido"),
  Patente: z.string().min(1, "La patente es requerida"),
  Razon: z.string().optional(),
  Detalles: z.array(consumoCreateSchema).optional(),
})
