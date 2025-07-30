import axios from 'axios'
import { Database } from '@/src/types/database.types'

const baseUrl = 'http://localhost:4001/api/ordenesDeTrabajo'

type OrdenDeTrabajo = Database['public']['Tables']['Ordenes de trabajo']['Row']
type Detalles = Database['public']['Tables']['Consumos Stock']['Insert'][]

export const getAllODT = async (): Promise<OrdenDeTrabajo[]> => {
  const response = await axios.get(`${baseUrl}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener órdenes de trabajo: ${response.statusText}`)
  }
}

export const getODTFiltered = async (
  Tipo_Documento?: number,
  Numero_Documento?: number,
  Patente?: string,
  FechaDesde?: Date,
  FechaHasta?: Date,
  Finalizadas?: boolean
): Promise<OrdenDeTrabajo[] | string> => {
  try {
    const response = await axios.get(`${baseUrl}/filter`, {
      params: {
        Tipo_Documento,
        Numero_Documento,
        Patente,
        FechaDesde,
        FechaHasta,
        Finalizadas
      }
    })
    if (response.status === 200) {
      return response.data
    } else {
      console.log(response)
      return 'Error Desconocido'
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 400) {
        return 'Error de validación'
      } else {
        console.log(error.response)
        return 'Error Desconocido'
      }
    } else {
      return 'Error Desconocido'
    }
  }
}

export const createODT = async (
  Tipo_Documento: number,
  Numero_Documento: number,
  Patente: string,
  Razon: string,
  Detalles?: Detalles
): Promise<OrdenDeTrabajo | string> => {
  try {
    const response = await axios.post(`${baseUrl}/create`, {
      Tipo_Documento,
      Numero_Documento,
      Patente,
      Razon,
      Detalles
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
        return 'Error de validación'
      } else {
        console.log(error.response)
        return 'Error Desconocido'
      }
    } else {
      return 'Error Desconocido'
    }
  }
}
