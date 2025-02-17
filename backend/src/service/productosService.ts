import supabase from "../supabase/client"
import { Database } from "../supabase/database.types"
import { getCategoriaById } from "./categoriasService"
import { getSubCategoriaById } from "./subCategoriasService"
import { getMarca_de_ProductosById } from "./marcaProductosService"
import { getProveedorById } from "./proveedoresService"

type ProductoAInsertar = Database["public"]["Tables"]["Productos"]["Insert"]
type ProductoAActualizar = Database["public"]["Tables"]["Productos"]["Update"]
type Producto = Database["public"]["Tables"]["Productos"]["Row"]

async function getProductos() {
  const { data, error } = await supabase
    .from("Productos")
    .select("*")
    .eq("Dado_de_baja", false)
  return data as Producto[]
}

async function getProductosByCodigo(codigo: string) {
  const { data, error } = await supabase
    .from("Productos")
    .select("*")
    .eq("Codigo", codigo)
    .select()
  if (error) {
    throw error
  } else {
    if (data.length === 0) {
      return null
    } else {
      return data[0] as Producto
    }
  }
}

async function uploadProductos(producto: ProductoAInsertar) {

  if(!producto.Codigo){
    throw new ReferenceError("Codigo no enviado")
  }else{
    const productoExistente = await getProductosByCodigo(producto.Codigo)
    if(productoExistente !== null){
      throw new ReferenceError("Codigo ya existente")
    }
  }

  if (producto.Categoria) {
    const categoria = await getCategoriaById(producto.Categoria)
    if (categoria === null || categoria.Dada_de_baja === true) {
      console.log("Hola")
      throw new ReferenceError("Categoria no encontrada")
    } else {
      if (producto.SubCategoria) {
        const subCategoria = await getSubCategoriaById(producto.SubCategoria)
        if (subCategoria === null || subCategoria.Dada_de_baja === true) {
          throw new ReferenceError("SubCategoria no encontrada")
        } else {
          if (categoria.id !== subCategoria.Categoria) {
            throw new ReferenceError(
              "La subcategoria no pertenece a la categoria"
            )
          }
        }
      }
    }
  } else {
    throw new ReferenceError("Categoria no encontrada")
  }
  if (producto.Marca) {
    const marca = await getMarca_de_ProductosById(producto.Marca)
    if (marca === null || marca.Dado_de_baja === true) {
      throw new ReferenceError("Marca no encontrada")
    }
  } else {
    throw new ReferenceError("Marca no encontrada")
  }
  if (producto.Proveedor) {
    const proveedor = await getProveedorById(producto.Proveedor)
    if (proveedor === null || proveedor.Dado_de_baja === true) {
      throw new ReferenceError("Proveedor no encontrado")
    }
  } else {
    throw new ReferenceError("Proveedor no encontrado")
  }
  const { data, error } = await supabase
    .from("Productos")
    .insert(producto)
    .select()
    .single()
  if (error) {
    throw error
  } else {
    return data as Producto
  }
}

async function updateProductos(
  codigoProducto: string,
  cambios: {
    Descripcion: string
    Precio: number
    PorcentajeAumento: number
    Baja: boolean
    Proveedor: number
  }
) {
  const productoACambiar = await getProductosByCodigo(codigoProducto)

  if (productoACambiar === null) {
    throw new ReferenceError("Producto no encontrado")
  }

  if (cambios.Descripcion) {
    productoACambiar.Descripcion = cambios.Descripcion
  }
  if (cambios.Precio) {
    productoACambiar.Precio = cambios.Precio
  } else {
    if (cambios.PorcentajeAumento && productoACambiar.Precio !== null) {
      productoACambiar.Precio *= 1 + cambios.PorcentajeAumento / 100
    }
  }
  if (cambios.Baja) {
    productoACambiar.Dado_de_baja = cambios.Baja
  }
  if (cambios.Proveedor) {
    productoACambiar.Proveedor = cambios.Proveedor
  }

  const { data, error } = await supabase
    .from("Productos")
    .update(productoACambiar)
    .eq("Codigo", codigoProducto)
    .select()
    .single()

  if (error) {
    throw error
  }
  return data as Producto
}

async function deleteProductos(codigo: string) {
  const { data, error } = await supabase
    .from("Productos")
    .update({ Dado_de_baja: true })
    .eq("Codigo", codigo)
    .select()
    .single()
  if (error) {
    throw error
  } else {
    return data as Producto
  }
}

async function  modificarStockProducto(codigo: string, cantidad: number) {
  const producto = await getProductosByCodigo(codigo)
  if (producto === null) {
    throw new ReferenceError("Producto no encontrado")
  }
  producto.Stock += cantidad
  
  const { data, error } = await supabase
    .from("Productos")
    .update(producto)
    .eq("Codigo", codigo)
    .select()
    .single()
  if (error) {
    throw error
  } else {
    return data as Producto
  }
  
}

export {
  getProductos,
  getProductosByCodigo,
  uploadProductos,
  updateProductos,
  deleteProductos,
  modificarStockProducto
}
