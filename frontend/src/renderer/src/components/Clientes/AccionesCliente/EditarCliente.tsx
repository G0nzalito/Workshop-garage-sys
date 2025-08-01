import { useConsts } from '@renderer/Contexts/constsContext'
import { useState } from 'react'
import { toast } from 'sonner'
import { Database } from '@/src/types/database.types'
import { editarCliente } from '../../../../../servicies/clientesService'
import { X } from 'lucide-react'

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

export default function EditarCliente({
  setClientes
}: {
  setClientes: React.Dispatch<React.SetStateAction<Cliente[] | null>>
}): JSX.Element {
  const { clienteSeleccionado, tiposDocumento, setClientes: setClientesConst } = useConsts()

  const [cargado, setCargado] = useState(true)

  interface FormData {
    Telefono: number
    Email: string
    Direccion: string
    Asociacion: boolean | string
    Baja: boolean | string
  }

  const [formData, setFormData] = useState<FormData>({
    Telefono: clienteSeleccionado?.Telefono || 0,
    Email: clienteSeleccionado?.Email || '',
    Direccion: clienteSeleccionado?.Direccion || '',
    Asociacion: clienteSeleccionado?.Numero_Socio !== null ? '1' : '0',
    Baja: clienteSeleccionado?.Dado_de_baja ? '0' : '1'
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

  const handleSubmit = (e): void => {
    e.preventDefault()

    console.log(formData)

    formData.Asociacion === '1' ? (formData.Asociacion = true) : (formData.Asociacion = false)
    formData.Baja === '0' ? (formData.Baja = true) : (formData.Baja = false)

    const toastLoading = toast.loading('Guardando cambios...')
    editarCliente(
      clienteSeleccionado!.Tipo_Documento,
      clienteSeleccionado!.Numero_Documento,
      formData.Direccion,
      formData.Telefono,
      formData.Email,
      formData.Asociacion,
      formData.Baja
    ).then((data) => {
      toast.dismiss(toastLoading)
      if (typeof data === 'string') {
        if (data === 'Cliente No Existente') {
          toast.error('El cliente no existe en la BD', {
            description: 'Comuniquese con el administrador del sistema',
            icon: <X />,
            duration: 5000
          })
        } else {
          toast.error('Error interno del sistema', {
            description: 'Comuniquese con el administrador del sistema',
            icon: <X />,
            duration: 5000
          })
        }
      } else {
        toast.success('Cliente editado correctamente')
        setClientes(null)
        setClientesConst((prevClientes) => {
          if (prevClientes) {
            return prevClientes.map((cliente) =>
              cliente.Tipo_Documento === clienteSeleccionado!.Tipo_Documento &&
              cliente.Numero_Documento === clienteSeleccionado!.Numero_Documento
                ? { ...cliente, ...data }
                : cliente
            )
          }
          return prevClientes
        })
      }
    })
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

  // console.log(formData)

  return (
    <div className="w-full ">
      <div className="mb-8">
        {cargado && (
          <>
            <p className="text-xl mb-2">
              Usted esta editando el cliente con documento:{' '}
              <span className="font-bold">
                &quot;
                {`${clienteSeleccionado?.Numero_Documento} - ${tiposDocumento.find((td) => td.id === clienteSeleccionado?.Tipo_Documento)?.Nombre}`}
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
                  className="input input-bordered w-full max-w-xs outline-1"
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
                  className="input input-bordered w-full max-w-xs outline-1"
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
                  className="input input-bordered w-full max-w-xs outline-1"
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
                    defaultChecked={formData.Asociacion === '1'}
                    onChange={handleChange}
                  />
                  <span> Si </span>
                  <input
                    type="radio"
                    name="Asociacion"
                    value={0}
                    className="radio radio-error outline-1"
                    defaultChecked={formData.Asociacion === '0'}
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
                  className="select select-bordered w-full max-w-xs mb-2 outline-1"
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

