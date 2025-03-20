import axios from 'axios'

const URL = 'http://localhost:4001/api/marcasProductos'

export const getMarcasProductos = async () => {
  const response = await axios.get(`${URL}/all`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener marcas de productos: ${response.statusText}`)
  }
}

export const createMarcaProducto = async (marcaProducto) => {
  try {
    const response = await axios.post(`${URL}/create`, marcaProducto)
    return response.data
  } catch (e) {
    if (e.status === 400) {
      return e.status
    } else {
      console.log('Error en la creacion de marcas: ', e)
      return e
    }
  }
}
