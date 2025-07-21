import { useState } from 'react'
import { toast } from 'sonner'
import { BadgeCheck, X } from 'lucide-react'
import { Database } from '@/src/types/database.types.js'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import { crearTipoDocumento } from '../../../../../servicies/clientesService.js'

type TipoDocumento = Database['public']['Tables']['Tipo_documento']['Row']

export default function CreateTipoDocumento(): JSX.Element {
  const { setTiposDocumento } = useConsts()

  const [formData, setFormData] = useState({
    Nombre: '',
    TipoDeCliente: ''
  })

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (): Promise<void> => {
    const toastEspera = toast.loading('Guardando tipo de documento...')
    const response: TipoDocumento | string = await crearTipoDocumento(
      formData.Nombre,
      formData.TipoDeCliente
    )
    toast.dismiss(toastEspera)
    if (typeof response === 'string') {
      if (response === 'Tipo de Documento Duplicado') {
        toast.error('Tipo de documento duplicado', {
          description: 'Este tipo de documento ya existe en la base de datos',
          duration: 5000,
          icon: <X />
        })
      } else {
        toast.error('Error al guardar el tipo de documento', {
          description: 'Contacte al programador inmediatamente',
          duration: 5000,
          icon: <X />
        })
      }
    } else {
      toast.success('Tipo de documento guardado correctamente', {
        description: `El tipo de documento ${formData.Nombre} ha sido guardado correctamente`,
        duration: 5000,
        icon: <BadgeCheck />
      })
      setTiposDocumento((prev) => [...prev, response])
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form
        id="formNuevoProveedor"
        className="flex flex-col items-center gap-4 w-full"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div className="flex items-center justify-center gap-4 w-full">
          <span className="text-left self-center font-bold">Nombre del tipo de documento: </span>
          <input
            type="text"
            className="input input-bordered outline-1 appearance-none"
            placeholder="Nombre del tipo de documento..."
            onChange={handleChange}
            name="Nombre"
          />
        </div>

        <div className="flex items-center justify-center gap-4 w-full">
          <span className="text-left self-center font-bold">¿Que tipo de cliente es?: </span>
          <input
            type="text"
            className="input input-bordered outline-1 appearance-none"
            placeholder="Nombre del tipo de cliente..."
            onChange={handleChange}
            name="TipoDeCliente"
          />
        </div>

        <div className="w-full flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Guardar tipo de documento</button>
        </div>
      </form>
    </div>
  )
}

