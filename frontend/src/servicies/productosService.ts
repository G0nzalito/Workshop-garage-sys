import axios, { AxiosError } from 'axios'
import { Database } from '@/src/types/database.types'

const API_URL = 'http://localhost:4001/api/productos'

type Producto = Database['public']['Tables']['Productos']['Row']
type ProductoAInsertar = Database['public']['Tables']['Productos']['Insert']
type Stock = Database['public']['Tables']['Stock']['Row']

export const getProductos = async (): Promise<Producto[]> => {
  const responseData = (await axios.get(`${API_URL}/all`)).data
  return responseData
}

export const getProductoByCodigo = async (codigo: string): Promise<Producto | null> => {
  try {
    const response = await axios.get(`${API_URL}/specific`, { params: { Codigo: codigo } })

    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError
    if (error.status === 404) {
      return null
    } else {
      console.log(error)
      return 500
    }
  }
}

export const hayStockParaVenta = async (
  codigo: string,
  cantidad: number,
  sucursal_id: number
): Promise<boolean> => {
  const response = await axios.get(`${API_URL}/hayStock`, {
    params: { Codigo: codigo, Cantidad: cantidad, Sucursal_id: sucursal_id }
  })
  if (response.status === 200) {
    return true
  } else {
    return false
  }
}

export const modificarStockProducto = async (
  productos: { Producto: Producto; cantidad: number; stockMaximo: number }[],
  Sucursal_id: number,
  suma: number
): Promise<string | number> => {
  const Productos: { Codigo: string; Cantidad: number }[] = []

  for (const producto of productos) {
    if (producto.Producto.Categoria !== 13) {
      if (suma) {
        Productos.push({
          Codigo: producto.Producto.Codigo,
          Cantidad: producto.cantidad
        })
      } else {
        Productos.push({
          Codigo: producto.Producto.Codigo,
          Cantidad: -producto.cantidad
        })
      }
    }
  }

  const response = await axios.put(`${API_URL}/updateStock`, {
    Productos: Productos,
    Sucursal_id
  })
  if (response.status === 200) {
    return response.data
  } else {
    return response.status
  }
}

export const obtenerFiltrados = async (
  filtros,
  sucursal
): Promise<{ Producto: Producto; Stock: number }[] | number> => {
  // console.log('Filtros:', filtros)
  const response = await axios.get(`${API_URL}/filter`, { params: filtros })
  if (response.status === 200) {
    const productos = response.data
    const productosTemp: { Producto: Producto; Stock: number }[] = []

    for (const producto of productos) {
      console.log('sucursal en obtener filtrados: ', sucursal)
      const stock = await obtenerStockProductos(producto.Codigo, sucursal)
      // console.log('Stock:', stock)
      productosTemp.push({ Producto: producto, Stock: stock[0].Cantidad })
    }

    const productosDevolver = productosTemp.sort((a, b) =>
      a.Producto.Codigo.localeCompare(b.Producto.Codigo)
    )
    return productosDevolver
  } else {
    return response.status
  }
}

export const crearProducto = async (
  nuevoProducto: ProductoAInsertar,
  nuevoStock,
  sucursales
): Promise<Producto | number> => {
  try {
    const response = await axios.post(`${API_URL}/create`, nuevoProducto)
    if (response.status === 201 && nuevoProducto.Categoria !== 13) {
      for (const sucursal of sucursales) {
        if (nuevoStock.Sucursal_id === sucursal.id) {
          await crearStockProducto(nuevoStock)
        } else {
          await crearStockProducto({
            Sucursal_id: sucursal.id,
            Codigo: nuevoProducto.Codigo,
            Cantidad: 0
          })
        }
      }
    }
    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError
    if (error.status === 500) {
      console.log(error)
      return error.status
    }
    return 400
  }
}

export const crearStockProducto = async (nuevoStock): Promise<Stock | number> => {
  try {
    const response = await axios.post(`${API_URL}/uploadStock`, nuevoStock)
    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError

    if (error.status === 500) {
      console.log(error)
      return 500
    }
    return 400
  }
}

export const obtenerStockProductos = async (codigo, sucursal): Promise<Stock | number> => {
  try {
    console.log('Sucursal:', sucursal)
    const response = await axios.get(`${API_URL}/stock`, {
      params: { Codigo: codigo, Sucursal_id: sucursal }
    })
    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError

    if (error.status === 400) {
      return error.status
    } else {
      console.log(error)
      return 500
    }
  }
}

export const eliminarProducto = async (codigo): Promise<string | number> => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, { params: { Codigo: codigo } })
    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError

    if (error.status === 400) {
      console.log(error)
      return error.status
    } else {
      console.log(error)
      return 500
    }
  }
}

export const modificarProducto = async (codigo, cambios): Promise<Producto | number> => {
  try {
    const response = await axios.put(`${API_URL}/update`, {
      Codigo: codigo,
      Descripcion: cambios.Descripcion,
      Precio: cambios.Precio,
      PorcentajeAumento: cambios.PorcentajeAumento,
      Baja: cambios.Baja,
      Proveedor: cambios.Proveedor
    })

    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError

    if (error.status === 400) {
      return error.status
    } else {
      console.log(error)
      return 500
    }
  }
}

export const aumentarPrecioSegunCatYSCat = async (
  categoria: number,
  porcentaje: number,
  subcategoria?: number,
  marca?: number
): Promise<string | number> => {
  try {
    const response = await axios.put(`${API_URL}/updatePrecioCategoria`, {
      Categoria: categoria,
      SubCategoria: subcategoria,
      Porcentaje: porcentaje,
      Marca: marca
    })
    return response.data
  } catch (e: unknown) {
    const error = e as AxiosError

    if (error.status === 400) {
      console.log(error)
      return error.status
    } else {
      console.log(error)
      return 500
    }
  }
}
