import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BadgeCheck, X } from 'lucide-react'
import { Database } from '@/src/types/database.types.js'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import { createModeloVehiculos } from '../../../../../servicies/marcaVehiculosService'
import Select from 'react-select'

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: 325
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

  menuList: (provided) => ({
    ...provided,
    maxHeight: '220px', // Altura máxima antes de mostrar el scroll
    overflowY: 'auto' // Muestra el scroll solo cuando es necesario
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

type Modelo = Database['public']['Tables']['Modelos']['Row']

export default function CreateModeloVehiculo({
  marca: selectedMarca
}: {
  marca: number
}): JSX.Element {
  const { marcasVehiculos, setModelos } = useConsts()

  const [formData, setFormData] = useState({
    Nombre: '',
    marca: selectedMarca !== -1 ? selectedMarca : 0
  })

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const [Marca, setMarca] = useState<{ value: number; label: string | undefined } | null>(null)

  const handleSelectChange = (selectedOption, setFunction, formDataName): void => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  useEffect(() => {
    if (selectedMarca !== null) {
      setMarca({
        value: selectedMarca,
        label: marcasVehiculos.find((marca) => marca.id === selectedMarca)?.Nombre
      })
    }
  }, [])

  const handleSubmit = async (): Promise<void> => {
    let falta = false

    if (formData.Nombre === '' || formData.Nombre === 'Falta') {
      falta = true
      setFormData((prev) => ({ ...prev, Nombre: 'Falta' }))
    }
    if (formData.marca === 0 || formData.marca === -1) {
      falta = true
      setFormData((prev) => ({ ...prev, marca: -1 }))
    }

    if (falta) {
      toast.error('Debe completar todos los campos', {
        description: 'Por favor, complete los campos requeridos',
        duration: 5000,
        icon: <X />
      })
      return
    } else {
      const toastEspera = toast.loading('Guardando Modelo...')
      const response: Modelo | number = await createModeloVehiculos(formData.Nombre, formData.marca)
      toast.dismiss(toastEspera)
      if (response === 400) {
        toast.error('Error al guardar el modelo', {
          description: 'Este modelo ya existe en la base de datos',
          duration: 5000,
          icon: <X />
        })
      } else {
        toast.success('Modelo guardado correctamente', {
          description: `El modelo ${formData.Nombre} ha sido guardado correctamente`,
          duration: 5000,
          icon: <BadgeCheck />
        })
        if (typeof response !== 'number') {
          setModelos((prev) => [...prev, response])
        }
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
        <span className="text-left pr-4 self-center font-bold">Marca: </span>
        <div className="flex flex-col">
          <Select
            name="Marca"
            options={marcasVehiculos.map((marca) => {
              return {
                value: marca.id,
                label: marca.Nombre
              }
            })}
            onChange={(e) => handleSelectChange(e, setMarca, 'marca')}
            value={Marca}
            styles={customStyles}
            placeholder="Seleccione una marca"
            className="w-full"
          />
          {formData.marca === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar una marca</span>
          )}
        </div>
        <span className="text-left self-center font-bold">Nombre Modelo: </span>
        <div className="flex flex-col">
          <input
            type="text"
            className="input input-bordered outline-1 appearance-none"
            placeholder="Nombre del modelo..."
            onChange={handleChange}
            name="Nombre"
          />
          {formData.Nombre === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">
              Debe escribir un nombre para el modelo
            </span>
          )}
        </div>

        <div className="col-span-2 flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Guardar Modelo</button>
        </div>
      </form>
    </div>
  )
}

