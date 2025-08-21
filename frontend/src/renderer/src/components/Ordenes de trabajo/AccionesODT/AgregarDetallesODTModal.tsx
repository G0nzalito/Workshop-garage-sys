import React from 'react'
import { Database } from '@/src/types/database.types'
import AgregarDetallesODT from '@renderer/components/Ordenes de trabajo/AgregarDetallesODT'

type Producto = Database['public']['Tables']['Productos']['Row']

export default function AgregarDetallesODTModal({
  cesta,
  setCesta
}: {
  cesta: { Producto: Producto; cantidad: number; stockMaximo: number }[]
  setCesta: React.Dispatch<
    React.SetStateAction<{ Producto: Producto; cantidad: number; stockMaximo: number }[]>
  >
}): JSX.Element {
  return (
    <>
      <AgregarDetallesODT cesta={cesta} setCesta={setCesta} />
    </>
  )
}

