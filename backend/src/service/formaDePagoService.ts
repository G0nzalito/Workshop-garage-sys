import supabase from "../supabase/client";
import { Database } from "../supabase/database.types";

type FormaDePago = Database["public"]["Tables"]["Medios Pago"]["Row"];

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
  console.log(data)
  return data as FormaDePago[];
}

export { getFormaDePagoById, getFormasDePago };
