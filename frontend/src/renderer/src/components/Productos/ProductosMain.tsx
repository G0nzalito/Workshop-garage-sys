import { useConsts } from '@renderer/Contexts/constsContext'
import { useEffect, useState } from 'react'
import { getMarcasProductos } from '../../../../servicies/marcaProductoService.js'
import { getProveedoresActivos } from '../../../../servicies/proveedoresService.js'
import {
  getCategoriasProductos,
  getSubCategoriasProductos
} from '../../../../servicies/categoriasYSubCategoriasService.js'
import BusquedaProductos from '@renderer/components/Productos/BusquedaProductos.js'
import NuevoProducto from '@renderer/components/Productos/NuevoProducto.js'
import AumentarPrecioPorCategoria from '@renderer/components/Productos/AumentarPrecioPorCategoria.js'

export default function ProductosMain(): JSX.Element {
  const { setMarcasProductos, setProveedores, setCategorias, setSubCategorias } = useConsts()

  const [activo, setActivo] = useState('')

  useEffect(() => {
    getMarcasProductos().then((data) => {
      setMarcasProductos(data)
    })
    getProveedoresActivos().then((data) => {
      setProveedores(data)
    })
    getCategoriasProductos().then((data) => {
      setCategorias(data)
    })
    getSubCategoriasProductos().then((data) => {
      setSubCategorias(data)
    })
  }, [])

  return (
    <div className="flex w-full flex-col bg-base-100 text-white gap-2 p-4">
      <h1 className="text-2xl">Seleccione una opción: </h1>
      <div className="flex justify-start gap-2">
        <button className={`btn btn-accent ${activo === 'busqueda' ? '': 'btn-soft'}`} onClick={() => setActivo('busqueda')}>Busqueda de productos</button>
        <button className={`btn btn-accent ${activo === 'nuevo' ? '': 'btn-soft'}`} onClick={() => setActivo('nuevo')}>Agregar Producto</button>
        <button className={`btn btn-accent ${activo === 'aumento' ? '': 'btn-soft'}`} onClick={() => setActivo('aumento')}>Aumentar precio</button>
      </div>
      {activo === 'busqueda' && <BusquedaProductos />}
      {activo === 'nuevo' && <NuevoProducto />}
      {activo === 'aumento' && <AumentarPrecioPorCategoria />}
    </div>
  )
}

