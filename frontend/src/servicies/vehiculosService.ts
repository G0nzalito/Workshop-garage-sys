import axios from 'axios'
import { Database } from '@/src/types/database.types'

type Vehiculo = Database['public']['Tables']['Vehiculo']['Row']
type VehiculoAInsertar = Database['public']['Tables']['Vehiculo']['Insert']
type VehiculoAMostrar = Omit<Vehiculo, "Cliente"> & { Cliente: string }


const baseUrl = 'http://localhost:4001/api/vehiculos'

export const getAllVehicle = async (): Promise<Vehiculo[]> => {
  const response = await axios.get(`${baseUrl}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener vehiculos: ${response.statusText}`)
  }
}

// export async function getVehiculoFiltrado(
//   patenteVehiculo: string,
//   cliente: string,
//   marca: number,
//   mnodelo: number,
//   motor: string
// ){

// }

export async function getVehiculoPorPatente(Patente: string): Promise<VehiculoAMostrar> {
  const response = await axios.get(`${baseUrl}/specific`, { params: { Patente } })
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener vehiculos por patente: ${response}`)
  }
}

export async function getVehiculosFiltrados(
  Marca?: number,
  Modelo?: number,
  Motor?: string,
  Tipo_Documento?: number,
  Numero_Documento?: number
): Promise<VehiculoAMostrar[]> {
  console.log(typeof Numero_Documento)
  const response = await axios.get(`${baseUrl}/filter`, {
    params: { Marca, Modelo, Motor, Tipo_Documento, Numero_Documento }
  })
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener vehiculos filtrados: ${response.statusText}`)
  }
}

export const crearVehiculo = async (
  vehiculo: VehiculoAInsertar,
  dueño: { Tipo_Documento: number; Numero_Documento: number }
): Promise<Vehiculo> => {
  console.log(typeof vehiculo.Kilometros)
  console.log(typeof console.log(vehiculo))
  const response = await axios.post(`${baseUrl}/create`, { vehiculo, dueño })
  if (response.status === 201) {
    return response.data
  } else {
    throw new Error(`Error al crear vehiculo: ${response.statusText}`)
  }
}
