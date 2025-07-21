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

export default function EditarCliente(): JSX.Element {
  const { clientes, clienteSeleccionado } = useConsts()

  const [Cliente, setCliente] = useState()
  const [cargado, setCargado] = useState(true)

  interface FormData {
    Telefono: number
    Email: string
    Direccion: string
    Asociacion: boolean
    Baja: boolean
  }

  const [formData, setFormData] = useState<FormData>({
    Telefono: clienteSeleccionado?.Telefono || 0,
    Email: clienteSeleccionado?.Email || '',
    Direccion: clienteSeleccionado?.Direccion || '',
    Asociacion: clienteSeleccionado?.Numero_Socio !== null ? true : false,
    Baja: clienteSeleccionado?.Dado_de_baja || false
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

    console.log('Form data:', formData)

    // const toastLoading = toast.loading('Guardando cambios...')
    // editarVehiculo(formData.Patente, formData.Kilometros, {
    //   Tipo_Documento: parseInt(formData.Cliente.split('-')[0]),
    //   Numero_Documento: parseInt(formData.Cliente.split('-')[1])
    // })
    //   .then(() => {
    //     toast.success('Producto editado correctamente', { id: toastLoading })
    //   })
    //   .catch((error) => {
    //     toast.error(`Error al editar el producto: ${error}`, { id: toastLoading })
    //   })
  }

  // useEffect(() => {
  //   if (clienteSeleccionado) {
  //     setCargado(false)
  //     setClienteSeleccionado(
  //       clientes.find(
  //         (c) =>
  //           c.Tipo_Documento === parseInt(clienteSeleccionado.Cliente.split('-')[0]) &&
  //           c.Numero_Documento === parseInt(clienteSeleccionado.Cliente.split('-')[1])
  //       )
  //     )
  //   }
  //   setCargado(true)
  // }, [clienteSeleccionado])

  console.log(formData)

  return (
    <div className="w-full ">
      <div className="mb-8">
        {cargado && (
          <>
            <p className="text-xl mb-2">
              Usted esta editando el cliente con documento:{' '}
              <span className="font-bold">
                &quot;
                {`${clienteSeleccionado?.Numero_Documento} - ${clienteSeleccionado?.Tipo_Documento}`}
                &quot;
              </span>{' '}
            </p>
            <p className="text-lg"> Ingrese sus cambios en los siguientes campos:</p>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Teléfono: </legend>
                <input
                  type="number"
                  name="Telefono"
                  onChange={handleChange}
                  defaultValue={formData.Telefono}
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Ingrese el nuevo teléfono"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Email: </legend>
                <input
                  type="email"
                  name="Email"
                  onChange={handleChange}
                  defaultValue={formData.Email}
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Ingrese el nuevo email"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Dirección: </legend>
                <input
                  type="text"
                  name="Direccion"
                  onChange={handleChange}
                  defaultValue={formData.Direccion}
                  className="input input-bordered w-full max-w-xs"
                  placeholder="Ingrese la nueva dirección"
                />
              </fieldset>
              <fieldset className="fieldset">
                <span className="fieldset-legend text-right pr-4 self-center font-medium">
                  ¿Quiere asociarse?
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="Asociacion"
                    value={1}
                    className="radio radio-success outline-1"
                    defaultChecked={formData.Asociacion}
                    onChange={handleChange}
                  />
                  <span> Si </span>
                  <input
                    type="radio"
                    name="Asociacion"
                    value={0}
                    className="radio radio-error outline-1"
                    defaultChecked={!formData.Asociacion}
                    onChange={handleChange}
                  />
                  <span> No </span>
                </div>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-sm">Estado de cliente: </legend>
                <select
                  name="Baja"
                  defaultValue={formData.Baja ? '0' : '1'}
                  className="select select-bordered w-full max-w-xs mb-2"
                  onChange={handleChange}
                >
                  <option value={1} label="Listado" />
                  <option value={0} label="No listado" />
                </select>
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

