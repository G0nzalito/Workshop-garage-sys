import { useState } from 'react'
import { uploadCategoria } from '../../../../servicies/categoriasYSubCategoriasService.js'
import { toast } from 'sonner'
import { BadgeCheck, X } from 'lucide-react'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import { Database } from '@/src/types/database.types.js'

type Categoria = Database['public']['Tables']['Categorias']['Row']

export default function NuevaCategoria({ onClose }: { onClose: () => void }): JSX.Element {
  const { setCategorias } = useConsts()

  const [formData, setFormData] = useState({
    Descripcion: ''
  })

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async () => {
    const toastEspera = toast.loading('Guardando proveedor...')
    const response: Categoria | number = await uploadCategoria(formData)
    console.log(response)
    toast.dismiss(toastEspera)
    if (response === 400) {
      toast.error('Error al guardar la categoría', {
        description: 'Esta categoría ya existe en la base de datos',
        duration: 5000,
        icon: <X />
      })
    } else {
      toast.success('Categoría guardada correctamente', {
        description: `La categoría ${formData.Descripcion} ha sido guardada correctamente`,
        duration: 5000,
        icon: <BadgeCheck />
      })
      if (typeof response !== 'number') {
        setCategorias((prev) => [...prev, response])
      }
      onClose()
    }
  }

  return (
    <div className="h-46 w-96">
      <form
        id="formNuevaCategoría"
        className="grid grid-cols-[180px_1fr] gap-y-4 p-4 max-w-2xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <span className="text-left pr-4 self-center font-bold">Nombre Categoría: </span>
        <input
          type="text"
          className="input input-bordered appearance-none w-full"
          placeholder="Nombre de la categoría..."
          onChange={handleChange}
          name="Descripcion"
        />

        <div className="col-span-2 flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Guardar categoría</button>
        </div>
      </form>
    </div>
  )
}

