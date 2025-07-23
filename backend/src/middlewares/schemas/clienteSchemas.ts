import { z } from "zod"

export const clienteConsultSchema = z.object({
  Tipo_Documento: z.number().min(1, "El Tipo de documento es requerido"),
  Numero_Documento: z
    .number()
    .int()
    .min(1, "El Número de documento es requerido"),
})

export const clienteInsertSchema = z.object({
  Tipo_Documento: z.number().min(1, "El Tipo de documento es requerido"),
  Numero_Documento: z
    .number()
    .int()
    .min(1, "El Número de documento es requerido"),
  Nombre: z.string().min(1, "El Nombre es requerido"),
  Telefono: z.number().int().optional(),
  Direccion: z.string().optional(),
  Email: z.string().email("Email inválido").optional().nullable(),
  Asociacion: z.boolean(),
})

export const clientFilterSchema = z.object({
  Tipo_Documento: z.optional(
    z.string().min(1, "Tipo de documento es requerido")
  ),
  Numero_Documento: z.optional(
    z.string().min(1, "Número de documento es requerido")
  ),
  Nombre: z.optional(z.string().min(1, "Nombre es requerido")),
  Numero_Socio: z.optional(z.string().min(1, "Número de socio es requerido")),
})

export const clientUpdateSchema = z.object({
  Tipo_Documento: z.number().min(1, "Tipo de documento es requerido"),
  Numero_Documento: z.number().int().min(1, "Número de documento es requerido"),
  Direccion: z.string().optional(),
  Telefono: z.number().int().optional(),
  Email: z.string().email("Email inválido").optional().nullable(),
  Asociacion: z.boolean().optional(),
  Baja: z.boolean().optional(),
})
