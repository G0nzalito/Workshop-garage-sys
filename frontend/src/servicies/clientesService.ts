import axios from 'axios'
import { Database } from '@/src/types/database.types'

type Cliente = Database['public']['Tables']['Cliente']['Row']
type ClienteAInsertar = Database['public']['Tables']['Cliente']['Insert']
type TipoDocumento = Database['public']['Tables']['Tipo_documento']['Row']

const URL = 'http://localhost:4001/api/clientes'

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await axios.get(`${URL}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener clientes: ${response.statusText}`)
  }
}

export const getTiposDocumento = async (): Promise<TipoDocumento[]> => {
  const response = await axios.get(`${URL}/tiposDocumento`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener tipos de documento: ${response.statusText}`)
  }
}

export const crearTipoDocumento = async (nombre: string): Promise<TipoDocumento | string> => {
  try {
    const response = await axios.post(`${URL}/tiposDocumento/create`, { Nombre: nombre })
    if (response.status === 201) {
      return response.data
    } else {
      return 'Error Desconocido'
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 400) {
        return 'Tipo de Documento Duplicado'
      } else {
        console.log(error.response)
        return 'Error Desconocido'
      }
    } else {
      return 'Error desconocido'
    }
  }
}

export const crearCliente = async (
  nuevoCliente: ClienteAInsertar
  // Asociacion: number
): Promise<Cliente | string> => {
  try {
    const response = await axios.post(`${URL}/create`, {
      ...nuevoCliente
      // Asociacion
    })
    if (response.status === 201) {
      return response.data
    } else {
      console.log(response)
      return 'Error Desconocido'
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 400) {
        return 'Cliente Duplicado'
      } else {
        console.log(error.response)
        return 'Error Desconocido'
      }
    } else {
      return 'Error desconocido'
    }
  }
}
