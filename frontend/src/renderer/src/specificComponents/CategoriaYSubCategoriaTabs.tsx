import NuevaCategoria from '@renderer/components/Productos/Categorias/NuevaCategoria'
import NuevaSubCategoria from '@renderer/components/Productos/SubCategorias/NuevaSubCategoria'
import { useEffect, useState } from 'react'

export default function CategoriaYSubCategoriaTabs({
  onClose,
  selectedCategoria
}: {
  onClose: () => void
  selectedCategoria: number | null
}): JSX.Element {
  const [selectedTab, setSelectedTab] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      setSelectedTab(null) // Al cerrar el modal, se desmarcan los tabs
    }
  }, [onClose])

  return (
    <>
      <div className="tabs tabs-border">
        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="Categoría"
          checked={selectedTab === 'categoria'}
          onChange={() => setSelectedTab('categoria')}
        />
        {selectedTab === 'categoria' && (
          <div className="tab-content border-base-300 bg-base-100 p-10">
            <NuevaCategoria onClose={onClose} />
          </div>
        )}

        <input
          type="radio"
          name="my_tabs_2"
          className="tab"
          aria-label="SubCategoría"
          checked={selectedTab === 'subcategoria'}
          onChange={() => setSelectedTab('subcategoria')}
        />
        {selectedTab === 'subcategoria' && (
          <div className="tab-content border-base-300 bg-base-100 p-10">
            <NuevaSubCategoria onClose={onClose} selectedCategoria={selectedCategoria} />
          </div>
        )}
      </div>
    </>
  )
}
