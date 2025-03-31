import Select from 'react-select'
import { useConsts } from '@renderer/Contexts/constsContext'
import { useEffect, useState } from 'react'
import { Database } from '@/src/types/database.types'
import { aumentarPrecioSegunCatYSCat } from '../../../../servicies/productosService.js'
import { toast } from 'sonner'

type Categoria = Database['public']['Tables']['Categorias']['Row']
type SubCategoria = Database['public']['Tables']['SubCategorias']['Row']

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

export default function AumentarPrecioPorCategoria({ props }: { props: any }): JSX.Element {
  const [categoria, setCategoria] = useState()
  const [subCategoria, setSubCategoria] = useState()
  const [subCategoriasLocales, setSubCategoriasLocales] = useState<SubCategoria[]>([])
  const { categorias, subCategorias } = useConsts()
  const [formData, setFormData] = useState({
    Categoria: 0,
    SubCategoria: 0,
    PorcentajeAumento: 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'Codigo') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.toUpperCase()
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName) => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const toastLoading = toast.loading('Modificando precios')
    console.log('formData', formData)
    aumentarPrecioSegunCatYSCat(
      formData.Categoria,
      formData.SubCategoria,
      formData.PorcentajeAumento
    )
      .then(() => {
        toast.dismiss(toastLoading)
        toast.success('Precios modificados correctamente')
        setFormData({
          Categoria: 0,
          SubCategoria: 0,
          PorcentajeAumento: 0
        })
        setCategoria({ value: 0, label: 'Selecciona una categoria' })
        setSubCategoria({ value: 0, label: 'Selecciona una subcategoria' })
      })
      .catch((error) => {
        toast.dismiss(toastLoading)
        toast.error('Error al modificar precios')
        console.log(error)
      })
  }

  useEffect(() => {
    setSubCategoriasLocales(
      subCategorias.filter((subCategoria) => subCategoria.Categoria === formData.Categoria)
    )
  }, [categoria])
  return (
    <>
      <div>
        <span className="badge badge-soft badge-info italic text-xl m-3">
          Aumento de precio por categoría
        </span>
      </div>
      <form className="grid grid-cols-[190px_1fr] gap-y-4 p-4 max-w-3xl" onSubmit={handleSubmit}>
        <span className="fieldset-legend text-right pr-4 self-center font-medium"> Categoría:</span>
        <div className="flex flex-col">
          <Select
            name="Categoria"
            options={categorias.map((categoria) => {
              return { value: categoria.id, label: categoria.Descripcion }
            })}
            onChange={(e) => {
              handleSelectChange(e, setCategoria, 'Categoria')
            }}
            value={categoria}
            placeholder="Selecciona una categoría..."
            styles={customStyles}
          ></Select>
        </div>
        {subCategoriasLocales?.length > 0 && (
          <>
            <span className="fieldset-legend text-right self-center font-medium">
              {' '}
              SubCategoría (Opcional):
            </span>
            <div className="">
              <Select
                name="SubCategoria"
                options={subCategoriasLocales.map((subCategoria) => {
                  return { value: subCategoria.id, label: subCategoria.Descripción }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setSubCategoria, 'SubCategoria')
                }}
                value={subCategoria}
                placeholder="Puede seleccionar una subcategoría..."
                styles={customStyles}
              ></Select>
            </div>
          </>
        )}
        <span className="fieldset-legend text-left self-center font-medium">
          Ingrese el porcentaje de aumento de precio:
        </span>
        <input
          name="PorcentajeAumento"
          type="number"
          className="input input-bordered w-full max-w-xs mb-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          placeholder="Ingrese el porcentaje como numero entero"
          onChange={handleChange}
          value={formData.PorcentajeAumento === 0 ? '' : formData.PorcentajeAumento}
        />
        <div className="col-span-2 flex justify-end mt-2">
          <button type="submit" className="btn btn-success btn-soft">
            Aumentar Precios
          </button>
        </div>
      </form>
    </>
  )
}

