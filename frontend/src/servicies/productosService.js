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
    // const stock = await obtenerStockProductos(codigo, sucursal)
    // if (stock) {
    //   // console.log('Stock:', stock[0].Cantidad)
    //   return { Producto: producto, Stock: stock[0].Cantidad }
    // } else {
    //   throw new Error(`Error al obtener stock del producto`)
    // }
  } else {
    if (response.status === 404) {
      return null
    } else {
      throw new Error(`Error al obtener producto: ${response.statusText}`)
    }
  }
}

export const hayStockParaVenta = async (codigo, cantidad, sucursal_id) => {
  const response = await axios.get(`${API_URL}/hayStock`, {
    params: { Codigo: codigo, Cantidad: cantidad, Sucursal_id: sucursal_id }
  })
  if (response.status === 200) {
    return true
  } else {
    return false
  }
}

export const modificarStockProducto = async (productos, Sucursal_id, suma) => {
  const Productos = []

  for (const producto of productos) {
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

  const response = await axios.put(`${API_URL}/updateStock`, {
    Productos: Productos,
    Sucursal_id
  })
  if (response.status === 200) {
    return response.data
  } else {
    return response.statusText
  }
}

export const obtenerFiltrados = async (filtros, sucursal) => {
  // console.log('Filtros:', filtros)
  const response = await axios.get(`${API_URL}/filter`, { params: filtros })
  if (response.status === 200) {
    const productos = response.data
    const productosTemp = []

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
    return response.statusText
  }
}

export const crearProducto = async (nuevoProducto, nuevoStock, sucursales) => {
  try {
    console.log(nuevoProducto)
    console.log(nuevoStock)
    console.log(sucursales)
    const response = await axios.post(`${API_URL}/create`, nuevoProducto)
    if (response.status === 201) {
      for (let sucursal of sucursales) {

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
  } catch (error) {
    if (error.status === 500) {
      console.log(error)
    }
    return error.status
  }
}

export const crearStockProducto = async (nuevoStock) => {
  try {
    const response = await axios.post(`${API_URL}/uploadStock`, nuevoStock)
    return response.data
  } catch (error) {
    if (error.status === 500) {
      console.log(error)
    }
    return error.status
  }
}

export const obtenerStockProductos = async (codigo, sucursal) => {
  try {
    console.log('Sucursal:', sucursal)
    const response = await axios.get(`${API_URL}/stock`, {
      params: { Codigo: codigo, Sucursal_id: sucursal }
    })
    return response.data
  } catch (error) {
    if (error.status === 400) {
      return error.status
    } else {
      console.log(error)
      return error
    }
  }
}

export const eliminarProducto = async (codigo) => {
  try {
    const response = await axios.delete(`${API_URL}/delete`, { params: { Codigo: codigo } })
    return response.data
  } catch (error) {
    if (error.status === 400) {
      console.log(error)
      return error.status
    } else {
      console.log(error)
      return error
    }
  }
}

export const modificarProducto = async (codigo, cambios) => {
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
  } catch (error) {
    if (error.status === 400) {
      return error.status
    } else {
      console.log(error)
      return error
    }
  }
}

export const aumentarPrecioSegunCatYSCat = async (categoria, subcategoria, porcentaje) => {
  try {
    const response = await axios.put(`${API_URL}/updatePrecioCategoria`, {
      Categoria: categoria,
      SubCategoria: subcategoria,
      Porcentaje: porcentaje
    })
    return response.data
  } catch (error) {
    if (error.status === 400) {
      console.log(error)
      return error.status
    } else {
      console.log(error)
      return error
    }
  }
}
