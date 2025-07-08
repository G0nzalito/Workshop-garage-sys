import { z } from "zod";
import { clienteConsultSchema } from "./clienteSchemas";

export const vehiculoSchema =
z.object({
  Patente: z.string().min(1, "La patente es requerida"),
  Marca: z.number().min(1, "La marca es requerida"),
  Modelo: z.number().min(1, "El modelo es requerido"),
  Año: z.number().int().min(1886, "El año debe ser un número válido"),
  Kilometros: z.number().int().nonnegative("Los kilómetros deben ser un número no negativo"),
  Motor: z.string().min(1, "El motor es requerido"),
})

export const vehiculoCreateSchema = z.object({
  vehiculo: vehiculoSchema,
  dueño: clienteConsultSchema
})