import axios from 'axios'
import { Database } from '@/src/types/database.types'

type Cliente = Database['public']['Tables']['Cliente']['Row']

const URL = 'http://localhost:4001/api/clientes'

export const getClientes = async (): Promise<Cliente[]> => {
  const response = await axios.get(`${URL}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener clientes: ${response.statusText}`)
  }
}
