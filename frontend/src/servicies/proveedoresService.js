import axios from 'axios'

const URL = 'http://localhost:4001/api/proveedores'

export const getProveedoresActivos = async () => {
  const response = await axios.get(`${URL}/active`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener proovedores: ${response.statusText}`)
  }
}

export const uploadProveedor = async (proveedor) => {
  try {
    const response = await axios.post(`${URL}/create`, proveedor)
    return response.data
  } catch (e) {
    if (e.status === 400) {
      return e.status
    } else {
      console.log(e)
      throw new Error(`Error al subir proveedor: ${e}`)
    }
  }
}
