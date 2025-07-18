import { useState } from 'react'
import { toast } from 'sonner'
import { BadgeCheck, X } from 'lucide-react'
import { Database } from '@/src/types/database.types.js'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import { createMarcaVehiculos } from '../../../../../servicies/marcaVehiculosService'

type Marca = Database['public']['Tables']['Marca_de_Vehiculos']['Row']

export default function CreateMarcaVehiculo(): JSX.Element {
  const { setMarcasVehiculos } = useConsts()

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
    const toastEspera = toast.loading('Guardando marca...')
    const response: Marca | number = await createMarcaVehiculos(formData)
    toast.dismiss(toastEspera)
    if (response === 400) {
      toast.error('Error al guardar la marca', {
        description: 'Esta marca ya existe en la base de datos',
        duration: 5000,
        icon: <X />
      })
    } else {
      toast.success('Marca guardada correctamente', {
        description: `La marca ${formData.Nombre} ha sido guardada correctamente`,
        duration: 5000,
        icon: <BadgeCheck />
      })
      if (typeof response !== 'number') {
        setMarcasVehiculos((prev) => [...prev, response])
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form
        id="formNuevoProveedor"
        className="grid grid-cols-3 gap-4 w-full"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <span className="text-left self-center font-bold">Nombre Marca: </span>
        <input
          type="text"
          className="input input-bordered outline-1 appearance-none"
          placeholder="Nombre de la marca..."
          onChange={handleChange}
          name="Nombre"
        />

        <div className="col-span-2 flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Guardar Marca</button>
        </div>
      </form>
    </div>
  )
}

