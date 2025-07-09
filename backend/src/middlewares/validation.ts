import appExpress from "express"
import { Schema, z, ZodError } from "zod"

const app = appExpress()
app.use(appExpress.json())

export const validateSchemaBody = (schema: Schema) => (req, res, next) => {
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      })
    }
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    })
  }
}

export const validateSchemaQuery = (schema: Schema) => (req, res, next) => {
  try {
    schema.parse(req.query)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      })
    }
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    })
  }
}
