import { z } from "zod"
import { clienteConsultSchema } from "./clienteSchemas"

export const vehiculoSchema = z.object({
  Patente: z.string().min(1, "La patente es requerida"),
  Marca: z.number().min(1, "La marca es requerida"),
  Modelo: z.number().min(1, "El modelo es requerido"),
  Año: z.number().int().min(1886, "El año debe ser un número válido"),
  Kilometros: z
    .number()
    .int()
    .nonnegative("Los kilómetros deben ser un número no negativo"),
  Motor: z.string().min(1, "El motor es requerido"),
})

export const vehiculoFilterSchema = z.object({
  Marca: z.optional(z.string().min(1, "La marca es requerida")),
  Modelo: z.optional(z.string().min(1, "El modelo es requerido")),
  Motor: z.optional(z.string().min(1, "El motor es requerido")),
  Tipo_documento: z.optional(
    z.string().min(1, "El tipo de documento es requerido")
  ),
  Numero_Documento: z.optional(
    z.string().min(1, "El número de documento es requerido")
  ),
})

export const vehiculoUpdateSchema = z.object({
  Patente: z.string().min(1, "La patente es requerida"),
  Kilometros: z.number().int().nonnegative("Los kilómetros deben ser un número no negativo"),
  Dueño: z.optional(clienteConsultSchema),
})

export const vehiculoCreateSchema = z.object({
  vehiculo: vehiculoSchema,
  dueño: clienteConsultSchema,
})
