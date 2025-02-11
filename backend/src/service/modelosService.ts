import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { getMarca_de_VehiculosById } from "./marcaService"

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

    throw new ReferenceError("El modelo ya existe")
  } catch (e: unknown) {
    if (e instanceof ReferenceError === false) {

      const marca = await getMarca_de_VehiculosById(nuevoModelo.Marca as number)

      if (marca.Dada_de_baja === true) {
        throw new ReferenceError("La marca a la que pertenece el modelo está dada de baja")
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
    }else{
      throw e
    }
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
