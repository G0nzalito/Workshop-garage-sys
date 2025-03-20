import { useState } from "react"
import {createMarcaProducto} from '../../../../../servicies/marcaProductoService.js'
import { toast } from "sonner"
import { BadgeCheck, X } from "lucide-react"

export default function NuevaMarca({onClose}: {onClose: () => void}): JSX.Element {

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

  const handleSubmit = async () => {
    const toastEspera = toast.loading('Guardando marca...')
    const response = await createMarcaProducto(formData)
    toast.dismiss(toastEspera)
    if(response === 400){
      toast.error('Error al guardar la marca', {
        description: 'Esta marca ya existe en la base de datos',
        duration: 5000,
        icon: <X/>
      })
    }else{
      toast.success('Marca guardada correctamente', {
        description: `La marca ${formData.Nombre} ha sido guardada correctamente`,
        duration: 5000,
        icon: <BadgeCheck/>
      })
      onClose()
    }
  }

  return(
    <div className="h-46 w-96">
      <form
        id="formNuevoProveedor"
        className="grid grid-cols-[140px_1fr] gap-y-4 p-4 max-w-2xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <span className="text-left pr-4 self-center font-bold">Nombre Marca: </span>
        <input
          type="text"
          className="input input-bordered appearance-none"
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