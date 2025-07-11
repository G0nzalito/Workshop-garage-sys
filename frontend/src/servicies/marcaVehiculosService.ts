import axios, { AxiosError } from 'axios'
import { Database } from '@/src/types/database.types'

const URLVehiculo = 'http://localhost:4001/api/marcasVehiculos'
const URLModelo = 'http://localhost:4001/api/modelos'

type MarcaVehiculo = Database['public']['Tables']['Marca_de_Vehiculos']['Row']
type Modelo = Database['public']['Tables']['Modelos']['Row']

export const getMarcasVehiculos = async (): Promise<MarcaVehiculo[]> => {
  const response = await axios.get(`${URLVehiculo}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener marcas de productos: ${response.statusText}`)
  }
}

export const getModeloVehiculos = async (): Promise<Modelo[]> => {
  const response = await axios.get(`${URLModelo}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener marcas de productos: ${response.statusText}`)
  }
}

export const createMarcaVehiculos = async (marcaVehiculo): Promise<number | MarcaVehiculo> => {
  try {
    const response = await axios.post(`${URLVehiculo}/create`, marcaVehiculo)
    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError
    if (error.status === 400) {
      return error.status
    } else {
      console.log('Error en la creacion de marcas: ', e)
      return error.status || 500
    }
  }
}
export const createModeloVehiculos = async (
  nombreModelo: string,
  marcaAsocidad: number
): Promise<number | Modelo> => {
  console.log('Creando modelo: ', nombreModelo, ' con marca: ', marcaAsocidad)
  try {
    const response = await axios.post(`${URLModelo}/create`, {
      Nombre: nombreModelo,
      Marca: marcaAsocidad
    })
    return response.data.modelo
  } catch (e: unknown) {
    const error = e as AxiosError
    if (error.status === 400) {
      return error.status
    } else {
      console.log('Error en la creacion de modelos: ', e)
      return error.status || 500
    }
  }
}

