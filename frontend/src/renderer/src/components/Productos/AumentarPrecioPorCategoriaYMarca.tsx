import Select from 'react-select'
import { useConsts } from '@renderer/Contexts/constsContext'
import { useEffect, useState } from 'react'
import { Database } from '@/src/types/database.types'
import { aumentarPrecioSegunCatYSCat } from '../../../../servicies/productosService'
import { toast } from 'sonner'

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

export default function AumentarPrecioPorCategoriaYMarca(): JSX.Element {
  const [categoria, setCategoria] = useState()
  const [subCategoria, setSubCategoria] = useState()
  const [marca, setMarca] = useState()
  const [opcionesCate, setOpcionesCate] = useState()
  const [subCategoriasLocales, setSubCategoriasLocales] = useState<SubCategoria[]>([])
  const { categorias, subCategorias, marcasProductos } = useConsts()
  const [formData, setFormData] = useState({
    Categoria: 0,
    SubCategoria: 0,
    Marca: 0,
    PorcentajeAumento: 0
  })

  const handleChange = (e): void => {
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

  const handleSelectChange = (selectedOption, setFunction, formDataName): void => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = (e): void => {
    e.preventDefault()

    if(formData.Categoria === -1 && formData.Marca === 0) {
      toast.error('No se puede aumentar el precio de todas las categorias y subcategorias sin especificar una marca')
      return
    }

    const toastLoading = toast.loading('Modificando precios')
    console.log('formData', formData)
    aumentarPrecioSegunCatYSCat(
      formData.Categoria,
      formData.PorcentajeAumento,
      formData.SubCategoria,
      formData.Marca
    )
      .then(() => {
        toast.dismiss(toastLoading)
        toast.success('Precios modificados correctamente')
        setFormData({
          Categoria: 0,
          SubCategoria: 0,
          Marca: 0,
          PorcentajeAumento: 0
        })
        //@ts-ignore Lo hago asi para que el componente select de react select funcione
        setCategoria({ value: 0, label: 'Selecciona una categoria' })
        //@ts-ignore Lo hago asi para que el componente select de react select funcione
        setSubCategoria({ value: 0, label: 'Selecciona una subcategoria' })
        //@ts-ignore Lo hago asi para que el componente select de react select funcione
        setMarca({ value: 0, label: 'Selecciona una marca' })
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

  useEffect(() => {
    const defaultCategorie = { value: -1, label: 'Aumentar todas las categorías' }
    const categoriasOptions = [defaultCategorie]
    categorias.forEach((categoria) => {
      categoriasOptions.push({
        value: categoria.id,
        label: categoria.Descripcion
      })
    })

    //@ts-ignore Lo hago asi para que el componente select de react select funcione
    setOpcionesCate(categoriasOptions)
  }, [])

  return (
    <>
      <div>
        <span className="badge badge-soft badge-info italic text-xl m-3">
          Aumento de precio por categoría Y/O marca
        </span>
      </div>
      <form className="grid grid-cols-[190px_1fr] gap-y-4 p-4 max-w-3xl" onSubmit={handleSubmit}>
        <span className="fieldset-legend text-right pr-4 self-center font-medium"> Categoría:</span>
        <div className="flex flex-col">
          <Select
            name="Categoria"
            options={opcionesCate}
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
        <span className="fieldset-legend text-right pr-4 self-center font-medium"> Marca:</span>
        <div className="flex flex-col">
          <Select
            name="Categoria"
            options={marcasProductos.map((marca) => {
              return { value: marca.id, label: marca.Nombre }
            })}
            onChange={(e) => {
              handleSelectChange(e, setMarca, 'Marca')
            }}
            value={marca}
            placeholder="Selecciona una marca..."
            styles={customStyles}
          ></Select>
        </div>
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
