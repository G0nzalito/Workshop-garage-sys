import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { crearProducto } from '../../../../servicies/productosService'
import { toast } from 'sonner'
import { BadgeCheck, PlusCircle, X } from 'lucide-react'
import PopUp from '@renderer/specificComponents/PopUp'
import NavBar from '@renderer/specificComponents/Navbar'
import NuevoProveedor from '@renderer/components/Proveedores/NuevoProveedor'

type formDataNuevoProducto = {
  Codigo: string
  Descripcion: string
  Categoria: number
  Marca: number
  SubCategoria: number
  Proveedor: number
  Precio: number
  Stock: number
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
    Codigo: '',
    Descripcion: '',
    Categoria: 0,
    Marca: 0,
    SubCategoria: 0,
    Proveedor: 0,
    Precio: 0,
    Stock: 0
  })

  const { proveedores, categorias, subCategorias, marcasProductos } = useConsts()
  const [Categoria, setCategoria] = useState()
  const [SubCategoria, setSubCategoria] = useState()
  const [subCategoriasLocal, setSubCategoriasLocal] = useState<SubCategoria[]>()
  const [Proveedor, setProveedor] = useState()
  const [Marca, setMarca] = useState()
  const [nuevoProveedor, setNuevoProveedor] = useState(false)

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

  const handleSubmit = async () => {
    const camposOpcionales = ['Precio', 'Stock']
    let falta = false

    if (subCategoriasLocal?.length === 0) {
      camposOpcionales.push('SubCategoria')
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
      const toastEspera = toast.loading('Agregando producto', {
        description: 'Agregando producto a la base de datos',
      })
      const respuesta = await crearProducto(formData)
      toast.dismiss(toastEspera)
      if (respuesta === 400) {
        toast.error('Codigo Duplicado', {
          description: 'El código del producto ya existe',
          duration: 5000,
          icon: <X />
        })
      } else {
        toast.success('Producto agregado', {
          description: `Producto de codigo ${formData.Codigo} agregado`,
          duration: 6000,
          icon: <BadgeCheck />
        })
        limpiarCampos()
      }
    }
  }

  const limpiarCampos = () => {
    setFormData((prevData) => ({
      ...prevData,
      Codigo: '',
      Descripcion: '',
      Categoria: 0,
      Marca: 0,
      SubCategoria: 0,
      Proveedor: 0
    }))
    //@ts-ignore - No se puede asignar un número a un string
    setCategoria({ value: 0, label: 'Seleccione una categoría' })
    //@ts-ignore - No se puede asignar un número a un string
    setSubCategoria({ value: 0, label: 'Seleccione una subcategoría' })
    //@ts-ignore - No se puede asignar un número a un string
    setProveedor({ value: 0, label: 'Seleccione un Proveedor' })
    //@ts-ignore - No se puede asignar un número a un string
    setMarca({ value: 0, label: 'Seleccione una Marca' })
  }

  useEffect(() => {
    setFormData((prevData) => {
      return {
        ...prevData,
        SubCategoria: 0
      }
    })
    setSubCategoriasLocal(
      subCategorias.filter((SubCategoria) => SubCategoria.Categoria === formData.Categoria)
    )
  }, [Categoria])

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-lg badge badge-info badge-soft">Agregar nuevo producto: </h1>
      {/* <span className='loading loading-bars loading-md'></span> */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="grid grid-cols-[180px_1fr_auto] gap-y-4 p-4 max-w-3xl"
      >
        {/* Código */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Código:</span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Codigo"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el código del nuevo producto"
            value={formData.Codigo}
            onChange={handleChange}
          />
          {formData.Codigo === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">El código es obligatorio</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Descripción */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          Descripción:
        </span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Descripcion"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el detalle del producto"
            value={formData.Descripcion}
            onChange={handleChange}
          />
          {formData.Descripcion === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">La descripción es obligatoria</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Proveedor */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Proveedor:</span>
        <div className="flex flex-col">
          <Select
            name="Proveedor"
            options={proveedores.map((Proveedor) => {
              return {
                value: Proveedor.id,
                label: Proveedor.Nombre
              }
            })}
            onChange={(e) => handleSelectChange(e, setProveedor, 'Proveedor')}
            value={Proveedor}
            styles={customStyles}
            placeholder="Seleccione un Proveedor"
            className="w-full"
          />
          {formData.Proveedor === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar un Proveedor</span>
          )}
        </div>
        <div className="pl-2 self-center">
          <button
            type="button"
            className="btn btn-sm btn-success btn-soft"
            onClick={() => setNuevoProveedor(true)}
          >
            <PlusCircle />
          </button>
        </div>

        {/* Categoría */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Categoría:</span>
        <div className="flex flex-col">
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
          {formData.Categoria === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar una categoría</span>
          )}
        </div>
        <div className="pl-2 self-center">
          <button className="btn btn-sm btn-success btn-soft">
            <PlusCircle />
          </button>
        </div>

        {/* SubCategoría (condicional) */}
        {subCategoriasLocal?.length > 0 && (
          <>
            <span className="fieldset-legend text-right pr-4 self-center font-medium">
              SubCategoría:
            </span>
            <div className="flex flex-col">
              <Select
                name="SubCategoria"
                options={subCategoriasLocal.map((SubCategoria) => {
                  return {
                    value: SubCategoria.id,
                    label: SubCategoria.Descripción
                  }
                })}
                onChange={(e) => handleSelectChange(e, setSubCategoria, 'SubCategoria')}
                value={SubCategoria}
                styles={customStyles}
                placeholder="Seleccione una subcategoría"
                className="w-full"
              />
              {formData.SubCategoria === -1 && (
                <span className="text-red-500 text-xs mt-1">Debe seleccionar una subcategoría</span>
              )}
            </div>
            <div className="pl-2 self-center">
              <button className="btn btn-sm btn-success btn-soft">
                <PlusCircle />
              </button>
            </div>
          </>
        )}

        {/* Marca */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Marca:</span>
        <div className="flex flex-col">
          <Select
            name="Marca"
            options={marcasProductos.map((Marca) => {
              return {
                value: Marca.id,
                label: Marca.Nombre
              }
            })}
            onChange={(e) => handleSelectChange(e, setMarca, 'Marca')}
            value={Marca}
            styles={customStyles}
            placeholder="Seleccione una Marca"
            className="w-full"
          />
          {formData.Marca === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar una Marca</span>
          )}
        </div>
        <div className="pl-2 self-center">
          <button className="btn btn-sm btn-success btn-soft">
            <PlusCircle />
          </button>
        </div>

        {/* Stock inicial */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          Stock inicial:
        </span>
        <div className="flex flex-col">
          <input
            type="number"
            name="Stock"
            className="input input-bordered outline-1 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Ingrese el stock inicial"
            onChange={handleChange}
            value={formData.Stock}
          />
        </div>
        <div className="pl-2 self-center"></div>

        {/* Precio */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Precio:</span>
        <div className="flex flex-col">
          <label className="input flex items-center w-full">
            $
            <input
              type="number"
              name="Precio"
              className="grow [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Ingrese el Precio del producto"
              onChange={handleChange}
              value={formData.Precio}
            />
          </label>
        </div>
        <div className="pl-2 self-center"></div>

        {/* Botón de envío */}
        <div className="col-span-2 flex justify-end mt-2">
          <button type="submit" className="btn btn-success btn-soft">
            Agregar Producto
          </button>
        </div>
      </form>
      <PopUp
        open={nuevoProveedor}
        onClose={() => {
          setNuevoProveedor(false)
        }}
        Component={NuevoProveedor}
        mainTitle="Nuevo Proveedor"
      />
    </div>
  )
}
