import appExpress from "express"
import { Schema, z, ZodError } from "zod"

const app = appExpress()
app.use(appExpress.json())

export const validateSchemaBody = (schema: Schema) => (req, res, next) => {
  try {
    console.log(req.body)
    schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(406).json({
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
    console.log(req.query)
    schema.parse(req.query)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(406).json({
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
