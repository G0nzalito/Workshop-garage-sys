import { useConsts } from '@renderer/Contexts/constsContext'
import { useState } from 'react'
import Select from 'react-select'
import { modificarProducto } from '../../../../../servicies/productosService.js'
import { toast } from 'sonner'

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: 460
  }),

  control: (provided: any) => ({
    ...provided,

    backgroundColor: 'burgundy ',

    borderColor: 'gray',

    color: 'white'
  }),

  input: (provided: any) => ({
    ...provided,
    color: 'white'
  }),

  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'black'
  }),

  menuList: (provided: any) => ({
    ...provided,
    maxHeight: '150px'
  }),

  option: (provided: any, state: any) => ({
    ...provided,

    backgroundColor: state.isSelected ? '#1f2937' : 'black', // Tailwind: bg-gray-800 o negro puro

    color: 'white',

    ':hover': {
      backgroundColor: '#374151' // Tailwind: bg-gray-700
    }
  }),

  singleValue: (provided: any) => ({
    ...provided,

    color: 'white'
  }),

  placeholder: (provided: any) => ({
    ...provided,
    color: 'white'
  })
}

export default function EditarProducto({
  props,
  onClose
}: {
  props: any
  onClose: () => void
}): JSX.Element {
  const { productoSeleccionado, proveedores } = useConsts()
  const [Proveedor, setProveedor] = useState()
  const [activeTab, setActiveTab] = useState<'precioDirecto' | 'porcentajeAumento'>('precioDirecto')
  interface FormData {
    Descripcion: string
    Precio: number
    PorcentajeAumento: number
    Baja: boolean | string
    Proveedor: number
  }

  const [formData, setFormData] = useState<FormData>({
    Descripcion: productoSeleccionado.Descripcion,
    Precio: productoSeleccionado.Precio,
    PorcentajeAumento: 0,
    Baja: productoSeleccionado.Dado_de_baja,
    Proveedor: productoSeleccionado.Proveedor
  })

  const handleChange = (e): void => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName) => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = (e): void => {
    e.preventDefault()

    formData.Baja === '1' ? (formData.Baja = false) : (formData.Baja = true)
    formData.Precio === productoSeleccionado.Precio ? (formData.Precio = 0) : formData.Precio
    const toastLoading = toast.loading('Guardando cambios...')
    modificarProducto(productoSeleccionado.Codigo, formData)
      .then(() => {
        toast.success('Producto editado correctamente', { id: toastLoading })
        onClose()
      })
      .catch((error) => {
        toast.error(`Error al editar el producto: ${error}`, { id: toastLoading })
      })
  }

  return (
    <div className="h-130 w-150">
      <div className="mb-8">
        <p className="text-xl mb-2">
          Usted esta editando el producto:{' '}
          <span className="font-bold">&quot;{productoSeleccionado.Descripcion}&quot;</span>{' '}
        </p>
        <p className="text-lg"> Ingrese sus cambios en los siguientes campos:</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm">Nueva descripción: </legend>
            <input
              name="Descripcion"
              type="text"
              className="input input-bordered w-full max-w-xs mb-2"
              value={formData.Descripcion}
              onChange={handleChange}
            />
          </fieldset>
          <div className="tabs tabs-border">
            <input
              type="radio"
              name="cambioPrecio"
              className="tab"
              aria-label="Cambio precio directo $$"
              onChange={() => {
                setActiveTab('precioDirecto')
                formData.PorcentajeAumento = 0
              }}
              checked={activeTab === 'precioDirecto'}
            />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Nuevo Precio: </legend>
                <input
                  name="Precio"
                  type="number"
                  className="input input-bordered w-full max-w-xs mb-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={formData.Precio}
                  onChange={handleChange}
                />
              </fieldset>
            </div>
            <input
              type="radio"
              name="cambioPrecio"
              className="tab"
              aria-label="Aumento Porcentual %"
              onChange={() => {
                setActiveTab('porcentajeAumento')
                formData.Precio = productoSeleccionado.Precio
              }}
              checked={activeTab === 'porcentajeAumento'}
            />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">
                  Ingrese el porcentaje de aumento de precio: (Precio actual:{' '}
                  {productoSeleccionado.Precio})
                </legend>
                <input
                  name="PorcentajeAumento"
                  type="number"
                  className="input input-bordered w-full max-w-xs mb-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Ingrese el porcentaje como numero entero"
                  onChange={handleChange}
                  value={formData.PorcentajeAumento === 0 ? '' : formData.PorcentajeAumento}
                />
              </fieldset>
            </div>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm">Estado de listado de producto: </legend>
            <select
              name="Baja"
              defaultValue={formData.Baja ? 2 : 1}
              className="select select-bordered w-full max-w-xs mb-2"
              onChange={handleChange}
            >
              <option value={1} label="Listado" />
              <option value={2} label="No listado" />
            </select>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm">Proveedor: </legend>
            <Select
              name="Proveedor"
              options={proveedores.map((Proveedor) => {
                return {
                  value: Proveedor.id,
                  label: Proveedor.Nombre
                }
              })}
              onChange={(e) => handleSelectChange(e, setProveedor, 'Proveedor')}
              value={Proveedor}
              styles={customStyles}
              placeholder="Seleccione un Proveedor"
              defaultValue={{
                value: productoSeleccionado.Proveedor,
                label: proveedores.find((p) => p.id === productoSeleccionado.Proveedor)?.Nombre
              }}
              className="w-full"
            />
          </fieldset>
          <div className="flex justify-end mt-8">
            <button className="btn btn-success btn-soft gap-2">
              <span className="material-symbols-outlined">Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
