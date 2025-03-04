import axios from 'axios'

const URL = 'http://localhost:4001/api/formaPago'

export const getFormasPago = async () => {
  const response = await axios.get(`${URL}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener formas de pago: ${response.statusText}`)
  }
}