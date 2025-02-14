import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { PostgrestError } from "@supabase/supabase-js"

type Marca_de_ProductosAInsertar = Database["public"]["Tables"]["Marca_de_Productos"]["Insert"]
type Marca_de_Productos = Database["public"]["Tables"]["Marca_de_Productos"]["Row"]

async function getMarca_de_Productos() {
  const { data, error } = await supabase.from("Marca_de_Productos").select("*")
  return data as Marca_de_Productos[]
}

async function getMarca_de_ProductosById(id: number) {
  const { data, error } = await supabase
    .from("Marca_de_Productos")
    .select("*")
    .eq("id", id)
    .single()
  if (error) {
    if (error.code === "PGRST116") {
      return null
    }
    throw new Error(error.message)
  } else {
    return data as Marca_de_Productos
  }
}

async function getMarca_de_ProductosByNombre(nombre: string) {
  const { data, error } = await supabase
    .from("Marca_de_Productos")
    .select("*")
    .eq("Nombre", nombre)
    .single()
  if (error) {
    throw error
  } else {
    return data as Marca_de_Productos
  }
}

async function uploadMarca_de_Productos(nuevaMarcaDeVehiculos: Marca_de_ProductosAInsertar) {
  
  try{
    
    const Marca_de_ProductosExistente = await getMarca_de_ProductosByNombre(nuevaMarcaDeVehiculos.Nombre)

    if(Marca_de_ProductosExistente.Dado_de_baja === true) {
      throw new ReferenceError("La marca se encuentra dada de baja")
    }else{
      throw new ReferenceError("La marca ya existe")
    }

    
  }catch(e: unknown){
    if(e instanceof ReferenceError === false){
      const { data, error } = await supabase
        .from("Marca_de_Productos")
        .insert(nuevaMarcaDeVehiculos)
        .select()
        .single()
      if (error) {
        throw error
      } else {
        return data as Marca_de_ProductosAInsertar
      }
    }else{
      throw e
    }
  } 

}

async function deleteMarca_de_Productos(nombreMarca: string) {
  const { data, error } = await supabase
    .from("Marca_de_Productos")
    .update({ Dado_de_baja: true })
    .eq("Nombre", nombreMarca)
    .single()
  if (error) {
    throw error
  } else {
    return data as Marca_de_Productos
  }
}

async function enableMarca_de_Productos(nombreMarca: string) {
  const { data, error } = await supabase
    .from("Marca_de_Productos")
    .update({ Dado_de_baja: false })
    .eq("Nombre", nombreMarca)
    .single()
  if (error) {
    throw error
  } else {
    return data as Marca_de_Productos
  }
}

export { getMarca_de_Productos, getMarca_de_ProductosById, uploadMarca_de_Productos, deleteMarca_de_Productos, getMarca_de_ProductosByNombre, enableMarca_de_Productos}
