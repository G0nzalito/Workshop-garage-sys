import { useConsts } from '@renderer/Contexts/constsContext'
import { useState } from 'react'
import Select from 'react-select'

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

export default function EditarProducto({ props }: { props: any }): JSX.Element {
  const { productoSeleccionado, proveedores } = useConsts()
  const [Proveedor, setProveedor] = useState()
  const [formData, setFormData] = useState({
    Descripcion: '',
    Precio: -1,
    PorcentajeAumento: -1,
    Baja: false,
    Proveedor: -1
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'Codigo') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.toUpperCase()
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName) => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  return (
    <div className="h-180 w-150">
      <div className="flex-col p-2">
        <p className="text-xl">
          Usted esta editando el producto:{' '}
          <span className="font-bold">&quot;{productoSeleccionado.Descripcion}&quot;</span>{' '}
        </p>
        <p className="text-lg"> Ingrese sus cambios en los siguientes campos:</p>
        <form className="flex flex-col gap-2">
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm">Nueva descripción: </legend>
            <input
              name="Descripcion"
              type="text"
              className="input input-bordered w-full max-w-xs mb-2"
              value={productoSeleccionado.Descripcion}
            />
          </fieldset>
          <div className="tabs tabs-border">
            <input
              type="radio"
              name="cambioPrecio"
              className="tab"
              aria-label="Cambio precio directo $$"
            />
            <div className="tab-content bg-base-100 border-base-300 p-6">
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Nuevo Precio: </legend>
                <input
                  name="Precio"
                  type="number"
                  className="input input-bordered w-full max-w-xs mb-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={productoSeleccionado.Precio}
                />
              </fieldset>
            </div>
            <input
              type="radio"
              name="cambioPrecio"
              className="tab"
              aria-label="Aumento Porcentual %"
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
                />
              </fieldset>
            </div>
          </div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm">Estado de listado de producto: </legend>
            <select
              name="Dado_de_baja"
              defaultValue={productoSeleccionado.Dado_de_baja ? 2 : 1}
              className="select select-bordered w-full max-w-xs mb-2"
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
        </form>
      </div>
    </div>
  )
}

