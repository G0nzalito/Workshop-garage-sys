import { data } from 'autoprefixer'
import axios from 'axios'

const API_URL = 'http://localhost:4001/api/productos'

export const getProductos = async () => {
  const responseData = (await axios.get(`${API_URL}/all`)).data
  return responseData
}

export const getProductoByCodigo = async (codigo) => {
  const response = await axios.get(`${API_URL}/specific`, { params: { Codigo: codigo } })
  if (response.status === 200) {
    return response.data
  } else {
    if (response.status === 404) {
      return null
    } else {
      throw new Error(`Error al obtener producto: ${response.statusText}`)
    }
  }
}

export const hayStockParaVenta = async (codigo, cantidad) => {
  const response = await axios.get(`${API_URL}/hayStock`, {
    params: { Codigo: codigo, Cantidad: cantidad }
  })
  if (response.status === 200) {
    return true
  } else {
    return false
  }
}

export const modificarStockProducto = async (productos) => {
  const Productos = []

  for (const producto of productos) {
    Productos.push({
      Codigo: producto.Producto.Codigo,
      Cantidad: -producto.cantidad
    })
  }

  const response = await axios.put(`${API_URL}/updateStock`, {
    data: {
      Productos: Productos
    } 
  })
  if (response.status === 200) {
    return response.data
  } else {
    return response.statusText
  }
}

export const obtenerFiltrados = async (filtros) => {
  console.log('Filtros:', filtros)
  const response = await axios.get(`${API_URL}/filter`, { params: filtros })
  if (response.status === 200) {
    return response.data
  } else {
    return response.statusText
  }
}