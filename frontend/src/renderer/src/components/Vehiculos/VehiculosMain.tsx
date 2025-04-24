import { getMarcasVehiculos, getModeloVehiculos } from '../../../../servicies/marcaVehiculosService'
import BusquedaVehiculo from '@renderer/components/Vehiculos/BusquedaVehiculo'
import { useConsts } from '@renderer/Contexts/constsContext'
import { useState, useEffect } from 'react'

export default function VehiculosMain(): JSX.Element {
  const [activo, setActivo] = useState('')
  const { setMarcasVehiculos, setModelos } = useConsts()

  useEffect(() => {
    getMarcasVehiculos().then((data) => {
      setMarcasVehiculos(data)
    })
    getModeloVehiculos().then((data) => {
      setModelos(data)
    })
  }, [])

  return (
    <div className="flex w-full flex-col bg-base-100 text-white gap-2 p-4">
      <div className="italic badge badge-soft badge-info text-2xl">Vehículos</div>
      <div className="italic text-xl">Seleccione una opción</div>
      <div className="flex justify-start gap-2">
        <button
          className={`btn btn-accent ${activo === 'busqueda' ? '' : 'btn-soft'}`}
          onClick={() => setActivo('busqueda')}
        >
          Busqueda de Vehículos
        </button>
        <button
          className={`btn btn-accent ${activo === 'nuevo' ? '' : 'btn-soft'}`}
          onClick={() => setActivo('nuevo')}
        >
          Agregar Vehículo
        </button>
        {/* <button
          className={`btn btn-accent ${activo === 'aumento' ? '' : 'btn-soft'}`}
          onClick={() => setActivo('aumento')}
        >
          Aumentar precio
        </button> */}
      </div>
      {activo === 'busqueda' && <BusquedaVehiculo />}
      {/* {activo === 'nuevo' && <NuevoProducto />} */}
      {/* {activo === 'aumento' && <AumentarPrecioPorCategoria />} */}
    </div>
  )
}
