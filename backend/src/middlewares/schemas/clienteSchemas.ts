import {z} from "zod"

export const clienteConsultSchema = z.object({
  Tipo_Documento: z.number().min(1, "El Tipo de documento es requerido"),
  Numero_Documento: z.number().int().min(1, "El Número de documento es requerido"),
})