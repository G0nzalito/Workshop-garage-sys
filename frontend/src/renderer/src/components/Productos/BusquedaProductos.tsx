import { Database } from '@/src/types/database.types'
import { useEffect, useState } from 'react'
import { obtenerFiltrados, getProductoByCodigo } from '../../../../servicies/productosService.js'
import Select from 'react-select'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import { Pencil, PlusCircle, Trash } from 'lucide-react'
import { toast } from 'sonner'

type SubCategoria = Database['public']['Tables']['SubCategorias']['Row']
type Productos = Database['public']['Tables']['Productos']['Row']

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: 300
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

type formFiltros = {
  descripcion: string
  marca: number
  categoria: number
  subcategoria: number
  proveedor: number
  codigo: string
}

export default function BusquedaProductos(): JSX.Element {
  const [marca, setMarca] = useState()
  const [proveedor, setProveedor] = useState()
  const [categoria, setCategoria] = useState()
  const [subcategoriaSelec, setSubcategoriaSelec] = useState()
  const [subCategoriasLocal, setSubCategoriasLocal] = useState<SubCategoria[]>([])
  const [productos, setProductos] = useState<{ Producto: Productos; Stock: number }[]>()
  const { marcasProductos, categorias, subCategorias, proveedores, sucursalSeleccionada } =
    useConsts()

  const handleChange = (e): undefined => {
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

  const handleSelectChange = (selectedOption, setFunction, formDataName): undefined => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const [formdata, setFormData] = useState<formFiltros>({
    descripcion: '',
    marca: 0,
    categoria: 0,
    subcategoria: 0,
    proveedor: 0,
    codigo: ''
  })

  useEffect(() => {
    setFormData((prev) => {
      return {
        ...prev,
        subcategoria: 0
      }
    })
    if (formdata.categoria === 0) return
    setSubCategoriasLocal(
      subCategorias.filter((subCategorias) => subCategorias.Categoria === formdata.categoria)
    )
    setSubcategoriaSelec({ value: 0, label: 'Selecciona una subcategoría...' })
  }, [categoria])

  const limiparFiltros = () => {
    setFormData({
      descripcion: '',
      marca: 0,
      categoria: 0,
      subcategoria: 0,
      proveedor: 0,
      codigo: ''
    })
    //@ts-ignore si funciona, dejemoslo como está
    setMarca({ value: 0, label: 'Selecciona una marca...' })
    //@ts-ignore si funciona, dejemoslo como está
    setProveedor({ value: 0, label: 'Selecciona un proveedor...' })
    //@ts-ignore si funciona, dejemoslo como está
    setCategoria({ value: 0, label: 'Selecciona una categoría...' })
    //@ts-ignore si funciona, dejemoslo como está
    setSubcategoriaSelec({ value: 0, label: 'Selecciona una subcategoría...' })
    //@ts-ignore si funciona, dejemoslo como está
    setProductos()
  }

  const handleFilter = (e) => {
    e.preventDefault()

    const filtros = {
      Descripcion: formdata.descripcion,
      Marca: formdata.marca,
      Categoria: formdata.categoria,
      SubCategoria: formdata.subcategoria,
      Proveedor: formdata.proveedor
    }
    const toastLoading = toast.loading('Buscando productos...')
    if (formdata.codigo !== '') {
      getProductoByCodigo(formdata.codigo, sucursalSeleccionada).then((data) => {
        console.log(data)
        setProductos([data])
        toast.dismiss(toastLoading)
      })

      return
    }
    obtenerFiltrados(filtros, sucursalSeleccionada).then((data) => {
      setProductos(data)
      toast.dismiss(toastLoading)
    })
  }

  // console.log(productos ? productos[0] : 'No hay productos')

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <h2 className="">
          <span className="badge badge-soft badge-info text-lg italic">
            Criterios de busqueda:{' '}
          </span>
        </h2>
        <div className="flex gap-2">
          <form onSubmit={handleFilter} className="flex flex-wrap gap-3" id="formBusquedaProductos">
            <fieldset>
              <legend className="fieldset-legend"> Codigo Producto:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa la descripción..."
                name="codigo"
                onChange={handleChange}
                value={formdata.codigo}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Descripción:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa la descripción..."
                name="descripcion"
                onChange={handleChange}
                value={formdata.descripcion}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Marca:</legend>
              <Select
                name="Marca"
                options={marcasProductos.map((marca) => {
                  return { value: marca.id, label: marca.Nombre }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setMarca, 'marca')
                }}
                value={marca}
                placeholder="Selecciona una marca..."
                styles={customStyles}
              ></Select>
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Proveedor:</legend>
              <Select
                name="Proveedor"
                options={proveedores.map((proveedor) => {
                  return { value: proveedor.id, label: proveedor.Nombre }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setProveedor, 'proveedor')
                }}
                value={proveedor}
                placeholder="Selecciona un proveedor..."
                styles={customStyles}
              ></Select>
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Categorias:</legend>
              <Select
                name="Categoria"
                options={categorias.map((categoria) => {
                  return { value: categoria.id, label: categoria.Descripcion }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setCategoria, 'categoria')
                }}
                value={categoria}
                placeholder="Selecciona una categoría..."
                styles={customStyles}
              ></Select>
            </fieldset>
            <fieldset className={subCategoriasLocal.length === 0 ? 'hidden' : ''}>
              <legend className="fieldset-legend"> SubCategoria:</legend>
              <Select
                name="SubCategoria"
                options={subCategoriasLocal.map((subcategoria) => {
                  return { value: subcategoria.id, label: subcategoria.Descripción }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setSubcategoriaSelec, 'subcategoria')
                }}
                value={subcategoriaSelec}
                placeholder="Selecciona una subcategoría..."
                styles={customStyles}
              ></Select>
            </fieldset>
          </form>
        </div>
      </div>
      <div className="flex justify-end items-end gap-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            document.getElementById('formBusquedaProductos').requestSubmit()
          }}
        >
          Buscar
        </button>
        <button className="btn btn-warning" onClick={() => limiparFiltros()}>
          Limpiar Filtros
        </button>
      </div>
      <div className="divider"></div>
      <div>LISTA DE PRODUCTOS</div>
      <div>
        {productos ? (
          <table className="table outline-1">
            <th>Código</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>SubCategoría</th>
            <th>Marca</th>
            <th>Proveedor</th>
            <th>Stock</th>
            <th>Acciones</th>
            <tbody>
              {productos.length > 0 ? (
                productos.map((producto) => {
                  return (
                    <tr key={producto.Producto.Codigo}>
                      <td>{producto.Producto.Codigo}</td>
                      <td>{producto.Producto.Descripcion}</td>
                      <td>{producto.Producto.Precio}</td>
                      <td>
                        {
                          categorias.find(
                            (categoria) => categoria.id === producto.Producto.Categoria
                          )?.Descripcion
                        }
                      </td>
                      <td>
                        {producto.Producto.SubCategoria
                          ? subCategoriasLocal.length > 0
                            ? subCategoriasLocal.find(
                                (subCategoria) => subCategoria.id === producto.Producto.SubCategoria
                              )?.Descripción
                            : subCategorias.find(
                                (subCategoria) => subCategoria.id === producto.Producto.SubCategoria
                              )?.Descripción
                          : 'No posee Sub categoria'}
                      </td>
                      <td>
                        {
                          marcasProductos.find((marca) => marca.id === producto.Producto.Marca)
                            ?.Nombre
                        }
                      </td>
                      <td>
                        {
                          proveedores.find(
                            (proveedor) => proveedor.id === producto.Producto.Proveedor
                          )?.Nombre
                        }
                      </td>
                      <td>{producto.Stock}</td>
                      <td>
                        <div className="flex gap-2">
                          <button type="button" className="btn btn-warning btn-soft">
                            <Pencil size={16} />
                          </button>
                          <button type="button" className="btn btn-error btn-soft">
                            <Trash size={16} />
                          </button>
                          <button type="button" className="btn btn-info btn-soft">
                            <PlusCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8}>No se encontraron productos</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center text-2xl">
            <h2>Realize una busqueda filtrada para encontrar los productos</h2>
          </div>
        )}
      </div>
    </>
  )
}
