import supabase from "../supabase/client";
import { Database } from "../supabase/database.types";

type FormaDePago = Database["public"]["Tables"]["Medios Pago"]["Row"];
type Marketing = Database["public"]["Tables"]["Fuente MKT"]["Row"];

async function getFormaDePagoById(id: number) {
  const { data, error } = await supabase
    .from("Medios Pago")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw error;
  }
  return data as FormaDePago;
}

async function getFormasDePago(){
  const { data, error } = await supabase
    .from("Medios Pago")
    .select("*")
  if (error) {
    throw error;
  }
  return data as FormaDePago[];
}

async function getTarjetas() {
  const {data, error} = await supabase.from("Tarjetas").select()
  if (error) {
    throw error
  }
  console.log('data', data)
  return data as Database["public"]["Tables"]["Tarjetas"]["Row"][]
  
}

async function getMarketing(){
  const { data, error } = await supabase
    .from("Fuente MKT")
    .select("*")
  if (error) {
    throw error;
  }
  return data as Marketing[];
}

export { getFormaDePagoById, getFormasDePago, getTarjetas, getMarketing };
