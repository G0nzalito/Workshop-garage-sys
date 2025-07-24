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

export default function EliminarCliente({
  setClientes
}: {
  setClientes: React.Dispatch<React.SetStateAction<Cliente[] | null>>
}): JSX.Element {
  const { clienteSeleccionado, tiposDocumento } = useConsts()

  const [cargado, setCargado] = useState(true)

  const handleSubmit = (e): void => {
    e.preventDefault()

    const toastLoading = toast.loading('Guardando cambios...')
    editarCliente(
      clienteSeleccionado!.Tipo_Documento,
      clienteSeleccionado!.Numero_Documento,
      undefined,
      undefined,
      undefined,
      undefined,
      true
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
        toast.success('Cliente eliminado correctamente')
        setClientes(null)
      }
    })
  }

  return (
    <div className="w-full ">
      <div className="mb-8">
        {cargado && (
          <>
            <p className="text-4xl mb-4 align-middle">¡ATENCIÓN!</p>
            <p className="text-xl mb-8 mt-5">
              Usted esta por eliminar el cliente de nombre{' '}
              <span className="font-bold">{`${clienteSeleccionado?.Nombre}`}</span> con documento{' '}
              <span className="font-bold">
                {`${clienteSeleccionado?.Numero_Documento} - ${tiposDocumento.find((td) => td.id === clienteSeleccionado?.Tipo_Documento)?.Nombre}`}
              </span>{' '}
            </p>
            <p className="text-lg"> ¿Está seguro de que desea eliminar este cliente?</p>
            <div className="flex justify-between mt-8">
              <button className="btn btn-error gap-2">
                <span className="material-symbols-outlined" onClick={handleSubmit}>
                  Eliminar Cliente
                </span>
              </button>
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-success btn-soft gap-2">
                  <span className="material-symbols-outlined">Cambié de opinión</span>
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

