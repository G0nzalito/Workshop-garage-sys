import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"


type CategoriaAInsertar = Database["public"]["Tables"]["Categorias"]["Insert"]
type Categoria = Database["public"]["Tables"]["Categorias"]["Row"]

async function getCategorias() {
  const { data, error } = await supabase.from("Categorias").select("*")
  return data as Categoria[]
}

async function getCategoriaById(id: number) {
  const { data, error } = await supabase
    .from("Categorias")
    .select("*")
    .eq("id", id)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as Categoria
  }
}

async function uploadCategoria(nuevaCategoria: CategoriaAInsertar) {
  const { data, error } = await supabase
    .from("Categorias")
    .insert(nuevaCategoria)
    .select()
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw error
  }
  return data as Categoria
}

export { getCategorias, getCategoriaById, uploadCategoria }