import CreateModeloVehiculo from '@renderer/components/Modelo/NuevoModelo'
import CreateMarcaVehiculo from '@renderer/components/Marcas/Marcas Vehiculos/CreateMarcaVehiculo'

import { useState } from 'react'

export default function MarcaYModeloTabs({
  selectedMarca,
  defaultTab = 'marca'
}: {
  selectedMarca: number | null
  defaultTab?: 'marca' | 'modelo'
}): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<'marca' | 'modelo'>('marca')

  return (
    <>
      <div className="tabs tabs-border">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Marca"
          checked={selectedTab === 'marca'}
          onChange={() => setSelectedTab('marca')}
        />
        {selectedTab === 'marca' && (
          <div className="tab-content border-base-300 bg-base-100 p-10">
            <CreateMarcaVehiculo />
          </div>
        )}

        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Modelo"
          checked={selectedTab === 'modelo'}
          onChange={() => setSelectedTab('modelo')}
        />
        {selectedTab === 'modelo' && (
          <div className="tab-content border-base-300 bg-base-100 p-10">
            <CreateModeloVehiculo marca={selectedMarca ? selectedMarca : -1} />
          </div>
        )}
      </div>
    </>
  )
}

