import axios from 'axios'

const URL = 'http://localhost:4001/api/sucursales'

export const getSucursales = async () => {
  try {
    const response = await axios.get(`${URL}/all`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}

