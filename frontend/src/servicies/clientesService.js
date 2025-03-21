import axios from 'axios'

const URL = 'http://localhost:4001/api/clientes'

export const getClientes = async () => {
  const response = await axios.get(`${URL}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener clientes: ${response.statusText}`)
  }
}