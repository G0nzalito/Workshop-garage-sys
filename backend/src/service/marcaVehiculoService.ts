import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { PostgrestError } from "@supabase/supabase-js"

type Marca_de_VehiculosAInsertar = Database["public"]["Tables"]["Marca_de_Vehiculos"]["Insert"]
type Marca_de_Vehiculos = Database["public"]["Tables"]["Marca_de_Vehiculos"]["Row"]

async function getMarca_de_Vehiculos() {
  const { data, error } = await supabase.from("Marca_de_Vehiculos").select("*")
  return data as Marca_de_Vehiculos[]
}

async function getMarca_de_VehiculosById(id: number) {
  const { data, error } = await supabase
    .from("Marca_de_Vehiculos")
    .select("*")
    .eq("id", id)
    .single()
  if (error) {
    throw new Error(error.message)
  } else {
    return data as Marca_de_Vehiculos
  }
}

async function getMarca_de_VehiculosByNombre(nombre: string) {
  const { data, error } = await supabase
    .from("Marca_de_Vehiculos")
    .select("*")
    .eq("Nombre", nombre)
    .single()
  if (error) {
    throw error
  } else {
    return data as Marca_de_Vehiculos
  }
}

async function uploadMarca_de_Vehiculos(nuevaMarcaDeVehiculos: Marca_de_VehiculosAInsertar) {
  
  try{
    
    const Marca_de_VehiculosExistente = await getMarca_de_VehiculosByNombre(nuevaMarcaDeVehiculos.Nombre)

    if(Marca_de_VehiculosExistente.Dada_de_baja === true) {
      throw new ReferenceError("La marca se encuentra dada de baja")
    }else{
      throw new ReferenceError("La marca ya existe")
    }

    
  }catch(e: unknown){
    if(e instanceof ReferenceError === false){
      const { data, error } = await supabase
        .from("Marca_de_Vehiculos")
        .insert(nuevaMarcaDeVehiculos)
        .select()
        .single()
      if (error) {
        throw error
      } else {
        return data as Marca_de_VehiculosAInsertar
      }
    }else{
      throw e
    }
  } 

}

async function deleteMarca_de_Vehiculos(nombreMarca: string) {
  const { data, error } = await supabase
    .from("Marca_de_Vehiculos")
    .update({ Dada_de_baja: true })
    .eq("Nombre", nombreMarca)
    .single()
  if (error) {
    throw error
  } else {
    return data as Marca_de_Vehiculos
  }
}

async function enableMarca_de_vehiculos(nombreMarca: string) {
  const { data, error } = await supabase
    .from("Marca_de_Vehiculos")
    .update({ Dada_de_baja: false })
    .eq("Nombre", nombreMarca)
    .single()
  if (error) {
    throw error
  } else {
    return data as Marca_de_Vehiculos
  }
}

export { getMarca_de_Vehiculos, getMarca_de_VehiculosById, uploadMarca_de_Vehiculos, deleteMarca_de_Vehiculos, getMarca_de_VehiculosByNombre, enableMarca_de_vehiculos}
