import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'

type formDataNuevoProducto = {
  codigo: string
  descripcion: string
  categoria: number
  marca: number
  subCategoria: number
  proveedor: number
  precio: number
  stockInicial: number
}

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

type SubCategoria = Database['public']['Tables']['SubCategorias']['Row']

export default function NuevoProducto(): JSX.Element {
  const [formData, setFormData] = useState<formDataNuevoProducto>({
    codigo: '',
    descripcion: '',
    categoria: 0,
    marca: 0,
    subCategoria: 0,
    proveedor: 0,
    precio: 0,
    stockInicial: 0
  })

  const { proveedores, categorias, subCategorias, marcasProductos } = useConsts()
  const [categoria, setCategoria] = useState()
  const [subCategoria, setSubCategoria] = useState()
  const [subCategoriasLocal, setSubCategoriasLocal] = useState<SubCategoria[]>()
  const [proveedor, setProveedor] = useState()
  const [marca, setMarca] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'codigo') {
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

  const handleSubmit = () => {
    const camposOpcionales = ['precio', 'stockInicial']
    let falta = false

    if (subCategoriasLocal.length === 0) {
      camposOpcionales.push('subCategoria')
    }
    for (const key in formData) {
      if (
        !camposOpcionales.includes(key) &&
        (formData[key] === '' ||
          formData[key] === 'Falta' ||
          formData[key] === 0 ||
          formData[key] === -1)
      ) {
        falta = true
        if (typeof formData[key] === 'string') {
          setFormData((prevData) => ({
            ...prevData,
            [key]: 'Falta'
          }))
        } else {
          setFormData((prevData) => ({
            ...prevData,
            [key]: -1
          }))
        }
      }
    }

    if (!falta) {
      console.log('Enviando datos')
      console.log(formData)
      limpiarCampos()
    }
  }

  const limpiarCampos = () => {
    setFormData((prevData) => ({
      ...prevData,
      codigo: '',
      descripcion: '',
      categoria: 0,
      marca: 0,
      subCategoria: 0,
      proveedor: 0
    }))
    setCategoria({ value: 0, label: 'Seleccione una categoría' })
    setSubCategoria({ value: 0, label: 'Seleccione una subcategoría' })
    setProveedor({ value: 0, label: 'Seleccione un proveedor' })
    setMarca({ value: 0, label: 'Seleccione una marca' })
  }

  useEffect(() => {
    setSubCategoriasLocal(
      subCategorias.filter((subCategoria) => subCategoria.Categoria === formData.categoria)
    )
  }, [categoria])

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-lg badge badge-info badge-soft">Agregar nuevo producto: </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="grid grid-cols-[180px_1fr] gap-y-4 p-4 max-w-2xl"
      >
        {/* Código */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Código:</span>
        <div className="flex flex-col">
          <input
            type="text"
            name="codigo"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el código del nuevo producto"
            value={formData.codigo}
            onChange={handleChange}
          />
          {formData.codigo === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">El código es obligatorio</span>
          )}
        </div>

        {/* Descripción */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          Descripción:
        </span>
        <div className="flex flex-col">
          <input
            type="text"
            name="descripcion"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el detalle del producto"
            value={formData.descripcion}
            onChange={handleChange}
          />
          {formData.descripcion === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">La descripción es obligatoria</span>
          )}
        </div>

        {/* Proveedor */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Proveedor:</span>
        <div className="flex flex-col">
          <Select
            name="proveedor"
            options={proveedores.map((proveedor) => {
              return {
                value: proveedor.id,
                label: proveedor.Nombre
              }
            })}
            onChange={(e) => handleSelectChange(e, setProveedor, 'proveedor')}
            value={proveedor}
            styles={customStyles}
            placeholder="Seleccione un proveedor"
            className="w-full"
          />
          {formData.proveedor === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar un proveedor</span>
          )}
        </div>

        {/* Categoría */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Categoría:</span>
        <div className="flex flex-col">
          <Select
            name="categoria"
            options={categorias.map((categoria) => {
              return {
                value: categoria.id,
                label: categoria.Descripcion
              }
            })}
            onChange={(e) => handleSelectChange(e, setCategoria, 'categoria')}
            value={categoria}
            styles={customStyles}
            placeholder="Seleccione una categoría"
            className="w-full"
          />
          {formData.categoria === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar una categoría</span>
          )}
        </div>

        {/* SubCategoría (condicional) */}
        {subCategoriasLocal?.length > 0 && (
          <>
            <span className="fieldset-legend text-right pr-4 self-center font-medium">
              SubCategoría:
            </span>
            <div className="flex flex-col">
              <Select
                name="subCategoria"
                options={subCategoriasLocal.map((subCategoria) => {
                  return {
                    value: subCategoria.id,
                    label: subCategoria.Descripción
                  }
                })}
                onChange={(e) => handleSelectChange(e, setSubCategoria, 'subCategoria')}
                value={subCategoria}
                styles={customStyles}
                placeholder="Seleccione una subcategoría"
                className="w-full"
              />
              {formData.subCategoria === -1 && (
                <span className="text-red-500 text-xs mt-1">Debe seleccionar una subcategoría</span>
              )}
            </div>
          </>
        )}

        {/* Marca */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Marca:</span>
        <div className="flex flex-col">
          <Select
            name="marca"
            options={marcasProductos.map((marca) => {
              return {
                value: marca.id,
                label: marca.Nombre
              }
            })}
            onChange={(e) => handleSelectChange(e, setMarca, 'marca')}
            value={marca}
            styles={customStyles}
            placeholder="Seleccione una marca"
            className="w-full"
          />
          {formData.marca === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar una marca</span>
          )}
        </div>

        {/* Stock inicial */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          Stock inicial:
        </span>
        <div className="flex flex-col">
          <input
            type="number"
            name="stockInicial"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el stock inicial"
            onChange={handleChange}
          />
        </div>

        {/* Precio */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Precio:</span>
        <div className="flex flex-col">
          <label className="input flex items-center w-full">
            $
            <input
              type="number"
              name="precio"
              className="grow"
              placeholder="Ingrese el precio del producto"
              onChange={handleChange}
            />
          </label>
        </div>

        {/* Botón de envío */}
        <div className="col-span-2 flex justify-end mt-2">
          <button type="submit" className="btn btn-success btn-soft">
            Agregar Producto
          </button>
        </div>
      </form>
    </div>
  )
}

