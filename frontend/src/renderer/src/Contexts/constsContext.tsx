import { Database } from '@types'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

type Cliente = Database['public']['Tables']['Cliente']['Row']
type FormaDePago = Database['public']['Tables']['Medios Pago']['Row']
type Tarjeta = Database['public']['Tables']['Tarjetas']['Row']
type Marketing = Database['public']['Tables']['Fuente MKT']['Row']
type Comprobantes = Database['public']['Tables']['Conceptos Facturas']['Row']
type MarcasProductos = Database['public']['Tables']['Marca_de_Productos']['Row']
type Proveedores = Database['public']['Tables']['Proveedores']['Row']
type Categoria = Database['public']['Tables']['Categorias']['Row']
type SubCategoria = Database['public']['Tables']['SubCategorias']['Row']
type Sucursal = Database['public']['Tables']['Sucursales']['Row']
type Producto = Database['public']['Tables']['Productos']['Row']

type ClientesContextData = {
  sucursalSeleccionada: number
  setSucursalSeleccionada: React.Dispatch<React.SetStateAction<number>>
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
  formasPago: FormaDePago[]
  setFormasPago: React.Dispatch<React.SetStateAction<FormaDePago[]>>
  tarjetas: Tarjeta[]
  setTarjetas: React.Dispatch<React.SetStateAction<Tarjeta[]>>
  marketing: Marketing[]
  setMarketing: React.Dispatch<React.SetStateAction<Marketing[]>>
  comprobantes: Comprobantes[]
  setComprobantes: React.Dispatch<React.SetStateAction<Comprobantes[]>>
  marcasProductos: MarcasProductos[]
  setMarcasProductos: React.Dispatch<React.SetStateAction<MarcasProductos[]>>
  proveedores: Proveedores[]
  setProveedores: React.Dispatch<React.SetStateAction<Proveedores[]>>
  categorias: Categoria[]
  setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>
  subCategorias: SubCategoria[]
  setSubCategorias: React.Dispatch<React.SetStateAction<SubCategoria[]>>
  sucursales: Sucursal[]
  setSucursales: React.Dispatch<React.SetStateAction<Sucursal[]>>
  productoSeleccionado: Producto
  setProductoSeleccionado: React.Dispatch<React.SetStateAction<Producto>>
}

export const ConstContext = createContext<ClientesContextData | undefined>(undefined)

export const ConstsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [formasPago, setFormasPago] = useState<FormaDePago[]>([])
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [marketing, setMarketing] = useState<Marketing[]>([])
  const [comprobantes, setComprobantes] = useState<Comprobantes[]>([])
  const [marcasProductos, setMarcasProductos] = useState<MarcasProductos[]>([])
  const [proveedores, setProveedores] = useState<Proveedores[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([])
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState<number>(() => {
    const storedSucursal = sessionStorage.getItem('sucursalSeleccionada')
    if (storedSucursal) {
      return parseInt(storedSucursal)
    }
    return 0
  })
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto>({})

  // useEffect(() => {
  //   const storedSucursal = sessionStorage.getItem('sucursalSeleccionada')
  //   if (storedSucursal) {
  //     setSucursal(parseInt(storedSucursal))
  //   }
  // }, [])

  useEffect(() => {
    // console.log('holaaaa')
    sessionStorage.setItem('sucursalSeleccionada', sucursalSeleccionada.toString())
  }, [sucursalSeleccionada])

  return (
    <ConstContext.Provider
      value={{
        sucursalSeleccionada,
        setSucursalSeleccionada,
        clientes,
        setClientes,
        formasPago,
        setFormasPago,
        tarjetas,
        setTarjetas,
        marketing,
        setMarketing,
        comprobantes,
        setComprobantes,
        marcasProductos,
        setMarcasProductos,
        proveedores,
        setProveedores,
        categorias,
        setCategorias,
        subCategorias,
        setSubCategorias,
        sucursales,
        setSucursales,
        productoSeleccionado,
        setProductoSeleccionado
      }}
    >
      {children}
    </ConstContext.Provider>
  )
}

export const useConsts = () => {
  const context = useContext(ConstContext)
  if (!context) {
    throw new Error('useClientes must be used within a ClientesProvider')
  }
  return context
}
