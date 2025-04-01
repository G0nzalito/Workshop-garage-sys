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

export default function SeleccionSucursal({
  onClose,
  open
}: {
  open: boolean
  onClose: () => void
}): JSX.Element | null {
  const { setSucursalSeleccionada: setSucursal, sucursales } = useConsts()
  const [sucursalSelect, setSucursalSelect] = useState()
  const [formData, setFormData] = useState({
    sucursal: 0
  })

  const handleChange = (e): void => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName): void => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = (): void => {
    setSucursal(formData.sucursal)
    onClose()
  }

  if (!open) {
    return null
  }

  return (
    <div className="h-45 w-170">
      <form
        id="formAperturaSucursal"
        className="grid grid-cols-[180px_1fr] gap-y-4 p-4 max-w-2xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <span className="text-lg text-left text-white pr-4 self-center font-bold">
          Abrimos turno en:{' '}
        </span>
        <Select
          name="Sucursal"
          options={sucursales.map((sucursal) => {
            return {
              value: sucursal.id,
              label: `${sucursal.Nombre} - ${sucursal.Dirección}`
            }
          })}
          onChange={(e) => handleSelectChange(e, setSucursalSelect, 'sucursal')}
          value={sucursalSelect}
          styles={customStyles}
          placeholder="Seleccione una sucursal..."
          className="w-full"
        />
        {formData.sucursal === -1 && (
          <span className="text-red-500 text-xs mt-1">Debe seleccionar una sucursal</span>
        )}

        <span className="text-lg text-left text-white pr-4 self-center font-bold">
          Turno en sucursal:
        </span>
        <span className="text-lg text-left text-white pr-4 self-center font-bold">
          {' '}
          Por implementar :D
        </span>

        <div className="col-span-2 flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Empezar turno</button>
        </div>
      </form>
    </div>
  )
}
