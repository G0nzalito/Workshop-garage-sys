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
  const response = await axios.post(URL, proveedor)
  if (response.status === 201) {
    return response.data
  } else {
    throw new Error(`Error al subir proveedor: ${response.statusText}`)
  }
}
