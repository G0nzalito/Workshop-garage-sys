import { Database } from '@types'
import React, { createContext, ReactNode, useContext, useState } from 'react'

type Cliente = Database['public']['Tables']['Cliente']['Row']
type FormaDePago = Database['public']['Tables']['Medios Pago']['Row']
type Tarjeta = Database['public']['Tables']['Tarjetas']['Row']
type Marketing = Database['public']['Tables']['Fuente MKT']['Row']
type Comprobantes = Database['public']['Tables']['Conceptos Facturas']['Row']

type ClientesContextData = {
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
}

export const ConstContext = createContext<ClientesContextData | undefined>(undefined)

export const ConstsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [formasPago, setFormasPago] = useState<FormaDePago[]>([])
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [marketing, setMarketing] = useState<Marketing[]>([])
  const [comprobantes, setComprobantes] = useState<Comprobantes[]>([])

  return (
    <ConstContext.Provider
      value={{
        clientes,
        setClientes,
        formasPago,
        setFormasPago,
        tarjetas,
        setTarjetas,
        marketing,
        setMarketing,
        comprobantes,
        setComprobantes
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

