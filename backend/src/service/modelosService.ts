import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { getMarca_de_VehiculosById } from "./marcaVehiculoService"

type ModeloAInsertar = Database["public"]["Tables"]["Modelos"]["Insert"]
type Modelo = Database["public"]["Tables"]["Modelos"]["Row"]

async function getModelos() {
  const { data, error } = await supabase.from("Modelos").select("*")
  return data as Modelo[]
}

async function getModeloById(id: number) {
  const { data, error } = await supabase
    .from("Modelos")
    .select("*")
    .eq("id", id)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as Modelo
  }
}

async function getModeloByNombre(nombre: string) {
  const { data, error } = await supabase
    .from("Modelos")
    .select("*")
    .eq("Nombre", nombre)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw error
  } else {
    return data as Modelo
  }
}

async function getModelosDeMarca(idMarca: number) {
  const { data, error } = await supabase
    .from("Modelos")
    .select("*")
    .eq("Marca", idMarca)
  if (error) {
    throw error
  } else {
    return data as Modelo[]
  }
}

async function uploadModelo(nuevoModelo: ModeloAInsertar) {
  try {
    const ModeloExistente = await getModeloByNombre(nuevoModelo.Nombre)

    console.log("Modelo existente:", ModeloExistente)

    if (ModeloExistente) {
      throw new ReferenceError("El modelo ya existe")
    } else {
      const marca = await getMarca_de_VehiculosById(nuevoModelo.Marca as number)

      if (!marca) {
        throw new ReferenceError(
          "La marca a la que pertenece el modelo no existe"
        )
      }

      if (marca.Dada_de_baja === true) {
        throw new ReferenceError(
          "La marca a la que pertenece el modelo está dada de baja"
        )
      }

      const { data, error } = await supabase
        .from("Modelos")
        .insert(nuevoModelo)
        .select()
        .single()
      if (error) {
        throw error
      } else {
        return data as ModeloAInsertar
      }
    }
  } catch (e: unknown) {
    console.log("Error al verificar el modelo existente:", e)
  }
}

async function deleteModelo(id: number) {
  const { data, error } = await supabase
    .from("Modelos")
    .delete()
    .eq("id", id)
    .select()
    .single()
  if (error) {
    throw error
  } else {
    return data as Modelo
  }
}

export {
  deleteModelo,
  getModelos,
  getModeloById,
  getModeloByNombre,
  getModelosDeMarca,
  uploadModelo,
}
