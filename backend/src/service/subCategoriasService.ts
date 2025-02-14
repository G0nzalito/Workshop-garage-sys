import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"

type SubCategoriaAInsertar = Database["public"]["Tables"]["SubCategorias"]["Insert"]
type SubCategoria = Database["public"]["Tables"]["SubCategorias"]["Row"]

async function getSubCategorias() {
  const { data, error } = await supabase.from("SubCategorias").select("*")
  return data as SubCategoria[]
}

async function getSubCategoriaById(id: number) {
  const { data, error } = await supabase
    .from("SubCategorias")
    .select("*")
    .eq("id", id)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as SubCategoria
  }
}

async function getSubCategoriaByCategoria(categoria: number) {
  const { data, error } = await supabase
    .from("SubCategorias")
    .select("*")
    .eq("Categoria", categoria)
  if (error) {
    throw error
  } else {
    return data as SubCategoria[]
  }
}

async function uploadSubCategoria(nuevaSubCategoria: SubCategoriaAInsertar) {
  const { data, error } = await supabase
    .from("SubCategorias")
    .insert(nuevaSubCategoria)
    .select()
    .single()
  if (error) {
    throw error
  }
  return data as SubCategoria
}

export { getSubCategorias, getSubCategoriaById, uploadSubCategoria, getSubCategoriaByCategoria }