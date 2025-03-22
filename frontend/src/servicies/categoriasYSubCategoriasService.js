import axios from 'axios'

const URLCategorias = 'http://localhost:4001/api/categorias'
const URLSubCategorias = 'http://localhost:4001/api/subcategorias'

export const getCategoriasProductos = async () => {
  const response = await axios.get(`${URLCategorias}/active`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener categorias: ${response.statusText}`)
  }
}

export const getSubCategoriasProductosByCategoria = async (categoria) => {
  const response = await axios.get(`${URLSubCategorias}/specific`, {
    params: { Categoria: categoria }
  })
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener subcategorias: ${response.statusText}`)
  }
}

export const getSubCategoriasProductos = async () => {
  const response = await axios.get(`${URLSubCategorias}/active`)
  if (response.status === 200) {
    return response.data
  } else {
    throw new Error(`Error al obtener subcategorias: ${response.statusText}`)
  }
}

export const uploadCategoria = async (categoria) => {
  try {
    const response = await axios.post(`${URLCategorias}/create`, categoria)
    return response.data
  } catch (e) {
    if (e.status === 400) {
      console.log(e)
      return e.status
    } else {
      console.log(e)
      throw new Error(`Error al subir proveedor: ${e}`)
    }
  }
}

export const uploadSubCategoria = async (subcategoria) => {
  try {
    const response = await axios.post(`${URLSubCategorias}/create`, subcategoria)
    return response.data
  } catch (e) {
    if (e.status === 400) {
      console.log(e)
      return e.status
    } else {
      console.log(e)
      throw new Error(`Error al subir proveedor: ${e}`)
    }
  }
}
