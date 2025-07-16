import { useConsts } from '@renderer/Contexts/constsContext'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { modificarProducto } from '../../../../../servicies/productosService'
import { toast } from 'sonner'
import { Database } from '@/src/types/database.types'
import { editarVehiculo } from '../../../../../servicies/vehiculosService'

type Cliente = Database['public']['Tables']['Cliente']['Row']

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

export default function EditarVehiculo(): JSX.Element {
  const { vehiculoSeleccionado, clientes } = useConsts()

  const [Cliente, setCliente] = useState()
  const [cargado, setCargado] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente>()

  interface FormData {
    Patente: string
    Cliente: string
    Kilometros: number
  }

  const [formData, setFormData] = useState<FormData>({
    Patente: vehiculoSeleccionado.Patente,
    Cliente: vehiculoSeleccionado.Cliente,
    Kilometros: vehiculoSeleccionado.Kilometros
  })

  const handleChange = (e): void => {
    const { name, value, type } = e.target

    if (type === 'number') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10)
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName): void => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = (e): void => {
    e.preventDefault()

    const toastLoading = toast.loading('Guardando cambios...')
    editarVehiculo(formData.Patente, formData.Kilometros, {
      Tipo_Documento: parseInt(formData.Cliente.split('-')[0]),
      Numero_Documento: parseInt(formData.Cliente.split('-')[1])
    })
      .then(() => {
        toast.success('Producto editado correctamente', { id: toastLoading })
      })
      .catch((error) => {
        toast.error(`Error al editar el producto: ${error}`, { id: toastLoading })
      })
  }

  useEffect(() => {
    if (vehiculoSeleccionado) {
      setCargado(false)
      setClienteSeleccionado(
        clientes.find(
          (c) =>
            c.Tipo_Documento === parseInt(vehiculoSeleccionado.Cliente.split('-')[0]) &&
            c.Numero_Documento === parseInt(vehiculoSeleccionado.Cliente.split('-')[1])
        )
      )
    }
    setCargado(true)
  }, [vehiculoSeleccionado])

  console.log(formData)

  return (
    <div className="w-full ">
      <div className="mb-8">
        {cargado && (
          <>
            <p className="text-xl mb-2">
              Usted esta editando el vehículo de patente:{' '}
              <span className="font-bold">&quot;{vehiculoSeleccionado.Patente}&quot;</span>{' '}
            </p>
            <p className="text-lg"> Ingrese sus cambios en los siguientes campos:</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Nuevo Dueño: </legend>
                <Select
                  name="Cliente"
                  options={clientes
                    .filter((cliente) => cliente.id !== 0)
                    .map((cliente) => {
                      return {
                        value: `${cliente.Tipo_Documento}-${cliente.Numero_Documento}`,
                        label: `${cliente.Nombre} (${cliente.Tipo_Documento === 1 ? 'DNI' : 'CUIT'}-${cliente.Numero_Documento})`
                      }
                    })}
                  onChange={(e) => handleSelectChange(e, setCliente, 'Cliente')}
                  value={Cliente}
                  styles={customStyles}
                  placeholder="Seleccione un Cliente"
                  defaultValue={{
                    value: `${vehiculoSeleccionado.Cliente.split('-')[0]}-${vehiculoSeleccionado.Cliente.split('-')[1]}`,
                    label: `${clienteSeleccionado?.Nombre} (${clienteSeleccionado?.Tipo_Documento === 1 ? 'DNI' : 'CUIT'}-${clienteSeleccionado?.Numero_Documento})`
                  }}
                  className="w-full"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Kilometraje: </legend>
                <input
                  type="number"
                  name="Kilometros"
                  // value={formData.Kilometros}
                  onChange={handleChange}
                  defaultValue={vehiculoSeleccionado.Kilometros}
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Ingrese el nuevo kilometraje"
                />
              </fieldset>
              <div className="flex justify-end mt-8">
                <button className="btn btn-success btn-soft gap-2">
                  <span className="material-symbols-outlined">Guardar Cambios</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

