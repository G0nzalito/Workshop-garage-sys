import { getMarcasVehiculos, getModeloVehiculos } from '../../../../servicies/marcaVehiculosService'
import BusquedaVehiculo from '@renderer/components/Vehiculos/BusquedaVehiculo'
import { getClientes, getTiposDocumento } from '../../../../servicies/clientesService'
import { useConsts } from '@renderer/Contexts/constsContext'
import { useState, useEffect } from 'react'
import NuevoCliente from '@renderer/components/Clientes/NuevoCliente'

export default function ClientesMain(): JSX.Element {
  const [activo, setActivo] = useState('')
  const {
    setMarcasVehiculos,
    setModelos,
    clientes,
    setClientes,
    setTiposDocumento,
    tiposDocumento
  } = useConsts()

  useEffect(() => {
    getMarcasVehiculos().then((data) => {
      setMarcasVehiculos(data)
    })
    getModeloVehiculos().then((data) => {
      setModelos(data)
    })

    if (clientes.length === 0) {
      getClientes().then((data) => {
        setClientes(data)
      })
    }
    if (tiposDocumento.length === 0) {
      getTiposDocumento().then((data) => {
        setTiposDocumento(data)
      })
    }
  }, [])

  console.log(tiposDocumento)

  return (
    <div className="flex w-full flex-col bg-base-100 text-white gap-2 p-4">
      <div className="italic badge badge-soft badge-info text-2xl">Clientes</div>
      <div className="italic text-xl">Seleccione una opción</div>
      <div className="flex justify-start gap-2">
        <button
          className={`btn btn-accent ${activo === 'busqueda' ? '' : 'btn-soft'}`}
          onClick={() => setActivo('busqueda')}
        >
          Busqueda de Clientes
        </button>
        <button
          className={`btn btn-accent ${activo === 'nuevo' ? '' : 'btn-soft'}`}
          onClick={() => setActivo('nuevo')}
        >
          Agregar Cliente
        </button>
      </div>
      {activo === 'busqueda' && <BusquedaVehiculo />}
      {activo === 'nuevo' && <NuevoCliente />}
      {/* {activo === 'aumento' && <AumentarPrecioPorCategoria />} */}
    </div>
  )
}

