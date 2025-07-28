import { getClientes, getTiposDocumento } from '../../../../servicies/clientesService'
import { useConsts } from '@renderer/Contexts/constsContext'
import { useState, useEffect } from 'react'
import BusquedaCliente from '@renderer/components/Clientes/BusquedaCliente'
import NuevaODT from '@renderer/components/Ordenes de trabajo/NuevaODT'

export default function ODTMain(): JSX.Element {
  const [activo, setActivo] = useState('')
  const { setTiposDocumento, tiposDocumento, clientes, setClientes,} =
    useConsts()

  useEffect(() => {
    if (tiposDocumento.length === 0) {
      getTiposDocumento().then((data) => {
        setTiposDocumento(data)
      })
    }
    if (clientes.length === 0) {
      // Fetch clientes if not already loaded
      // Assuming there's a service to fetch clientes
      getClientes().then((data) => {
        setClientes(data)
      })
    }
  }, [])

  return (
    <div className="flex w-full flex-col bg-base-100 text-white gap-2 p-4">
      <div className="italic badge badge-soft badge-info text-2xl">Ordenes de trabajo</div>
      <div className="italic text-xl">Seleccione una opción</div>
      <div className="flex justify-start gap-2">
        <button
          className={`btn btn-accent ${activo === 'busqueda' ? '' : 'btn-soft'}`}
          onClick={() => setActivo('busqueda')}
        >
          Histórico de ordenes
        </button>
        <button
          className={`btn btn-accent ${activo === 'nuevo' ? '' : 'btn-soft'}`}
          onClick={() => setActivo('nuevo')}
        >
          Nueva Orden
        </button>
      </div>
      {activo === 'busqueda' && <BusquedaCliente />}
      {activo === 'nuevo' && <NuevaODT />}
      {/* {activo === 'aumento' && <AumentarPrecioPorCategoria />} */}
    </div>
  )
}
