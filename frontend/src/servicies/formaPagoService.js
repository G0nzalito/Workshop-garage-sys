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

export const getTarjetas = async () => {
  const response = await axios.get(`${URL}/tarjetas`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener tarjetas: ${response.statusText}`)
  }
}

export const getMarketing = async () => {
  const response = await axios.get(`${URL}/marketing`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener marketing: ${response.statusText}`)
  }
}
