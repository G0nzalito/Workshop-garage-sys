import { useState } from 'react'
import { uploadProveedor } from '../../../../servicies/proveedoresService.js'
import { toast } from 'sonner'
import { BadgeCheck, X } from 'lucide-react'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import { Database } from '@/src/types/database.types.js'

type Proveedor = Database['public']['Tables']['Proveedores']['Row']

export default function NuevoProveedor({ onClose }: { onClose: () => void }): JSX.Element {
  const { setProveedores } = useConsts()

  const [formData, setFormData] = useState({
    Nombre: ''
  })

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (): Promise<void> => {
    const toastEspera = toast.loading('Guardando proveedor...')
    const response: Proveedor | number = await uploadProveedor(formData)
    console.log(response)
    toast.dismiss(toastEspera)
    if (response === 400) {
      toast.error('Error al guardar el proveedor', {
        description: 'Este proveedor ya existe en la base de datos',
        duration: 5000,
        icon: <X />
      })
    } else {
      toast.success('Proveedor guardado correctamente', {
        description: `El proveedor ${formData.Nombre} ha sido guardado correctamente`,
        duration: 5000,
        icon: <BadgeCheck />
      })
      if (typeof response !== 'number') {
        setProveedores((prev) => [...prev, response])
      }
      onClose()
    }
  }

  return (
    <div className="h-46 w-96">
      <form
        id="formNuevoProveedor"
        className="grid grid-cols-[180px_1fr] gap-y-4 p-4 max-w-2xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <span className="text-left pr-4 self-center font-bold">Nombre Proveedor: </span>
        <input
          type="text"
          className="input input-bordered appearance-none w-full"
          placeholder="Nombre del proveedor..."
          onChange={handleChange}
          name="Nombre"
        />

        <div className="col-span-2 flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Guardar Proveedor</button>
        </div>
      </form>
    </div>
  )
}
