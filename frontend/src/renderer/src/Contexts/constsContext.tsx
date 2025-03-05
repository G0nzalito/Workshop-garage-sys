import { Database } from '@types'
import React, { createContext, ReactNode, useContext, useState } from 'react'

type Cliente = Database['public']['Tables']['Cliente']['Row']
type FormaDePago = Database['public']['Tables']['Medios Pago']['Row']
type Tarjeta = Database['public']['Tables']['Tarjetas']['Row']
type Marketing = Database['public']['Tables']['Fuente MKT']['Row']

type ClientesContextData = {
  clientes: Cliente[]
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>
  formasPago: FormaDePago[]
  setFormasPago: React.Dispatch<React.SetStateAction<FormaDePago[]>>
  tarjetas: Tarjeta[]
  setTarjetas: React.Dispatch<React.SetStateAction<Tarjeta[]>>
  marketing: Marketing[]
  setMarketing: React.Dispatch<React.SetStateAction<Marketing[]>>
}

export const ConstContext = createContext<ClientesContextData | undefined>(undefined)

export const ConstsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [formasPago, setFormasPago] = useState<FormaDePago[]>([])
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [marketing, setMarketing] = useState<Marketing[]>([])

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
        setMarketing
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

