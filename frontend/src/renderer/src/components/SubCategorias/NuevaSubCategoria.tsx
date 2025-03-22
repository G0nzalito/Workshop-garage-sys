import { useEffect, useState } from 'react'
import { uploadSubCategoria } from '../../../../servicies/categoriasYSubCategoriasService.js'
import { toast } from 'sonner'
import { BadgeCheck, X } from 'lucide-react'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import { Database } from '@/src/types/database.types.js'
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

type SubCategoria = Database['public']['Tables']['SubCategorias']['Row']

export default function NuevaSubCategoria({
  onClose,
  selectedCategoria
}: {
  onClose: () => void
  selectedCategoria: number | null
}): JSX.Element {
  const { setCategorias, categorias, setSubCategorias } = useConsts()

  const [formData, setFormData] = useState({
    Descripcion: '',
    Categoria: ''
  })

  const [Categoria, setCategoria] = useState()
  // const [SubCategoria, setSubCategoria] = useState()

  const handleSelectChange = (selectedOption, setFunction, formDataName) => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  useEffect(() => {
    if (selectedCategoria !== null) {
      setCategoria({
        value: selectedCategoria,
        label: categorias.find((categoria) => categoria.id === selectedCategoria).Descripcion
      })
    }
  }, [])

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async () => {
    const toastEspera = toast.loading('Guardando proveedor...')
    const response: SubCategoria | number = await uploadSubCategoria(formData)
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
        setSubCategorias((prev) => [...prev, response])
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
        <span className="text-left pr-4 self-center font-bold">Categoría: </span>
        <Select
          name="Categoria"
          options={categorias.map((Categoria) => {
            return {
              value: Categoria.id,
              label: Categoria.Descripcion
            }
          })}
          onChange={(e) => handleSelectChange(e, setCategoria, 'Categoria')}
          value={Categoria}
          styles={customStyles}
          placeholder="Seleccione una categoría"
          className="w-full"
        />
        <span className="text-left pr-4 self-center font-bold">Nombre SubCategoría: </span>
        <input
          type="text"
          className="input input-bordered appearance-none w-full"
          placeholder="Nombre de la SubCategoría..."
          onChange={handleChange}
          name="Descripcion"
        />

        <div className="col-span-2 flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Guardar SubCategoría</button>
        </div>
      </form>
    </div>
  )
}

