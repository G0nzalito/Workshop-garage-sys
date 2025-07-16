import { Database } from '@/src/types/database.types'
import AumentarStock from '@renderer/components/Productos/AccionesProductos/AumentarStock.js'
import EditarProducto from '@renderer/components/Productos/AccionesProductos/EditarProducto.js'
import EliminarProducto from '@renderer/components/Productos/AccionesProductos/EliminarProducto.js'
import { useConsts } from '@renderer/Contexts/constsContext.js'
import Modal from '@renderer/specificComponents/Modal.js'
import { Pencil, PlusCircle, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'
import {
  getProductoByCodigo,
  obtenerFiltrados,
  obtenerStockProductos
} from '../../../../servicies/productosService'

type SubCategoria = Database['public']['Tables']['SubCategorias']['Row']
type Productos = Database['public']['Tables']['Productos']['Row']

interface ProductosConStock {
  Producto: Productos
  Stock: number
}

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
  const [cargando, setCargando] = useState(false)
  const [productos, setProductos] = useState<{ Producto: Productos; Stock: number }[]>()

  const {
    marcasProductos,
    categorias,
    subCategorias,
    proveedores,
    sucursalSeleccionada,
    setProductoSeleccionado
  } = useConsts()

  // use states para abrir modals
  const [aumentarStock, setAumentarStock] = useState(false)
  const [eliminarProducto, setEliminarProducto] = useState(false)
  const [editarProducto, setEditarProducto] = useState(false)

  const openModals = (producto: Productos, setModal: (boolean) => void): void => {
    setProductoSeleccionado(producto)
    setModal(true)
  }

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
    //@ts-ignore Lo hago asi para que el componente select de react select funcione
    setSubcategoriaSelec({ value: 0, label: 'Selecciona una subcategoría...' })
  }, [categoria])

  // useEffect(() => {
  //   if (editarProducto === false && eliminarProducto === false && aumentarStock === false) {
  //     limpiarFiltros()
  //   }
  // }, [editarProducto, eliminarProducto])

  const limpiarFiltros = (): void => {
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
    setSubCategoriasLocal([])
  }

  const handleFilterCodigo = async (codigo, sucursal): Promise<ProductosConStock[] | number> => {
    const productoConStock: ProductosConStock[] = []
    const producto = await getProductoByCodigo(codigo)
    if (producto) {
      if (typeof producto === 'number') {
        return producto
      } else {
        const stock = await obtenerStockProductos(codigo, sucursal)
        productoConStock.push({ Producto: producto, Stock: stock[0].Cantidad })
        return productoConStock
      }
    } else {
      return 404
    }
  }

  const handleFilter = (e): void => {
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
      setCargando(true)
      handleFilterCodigo(formdata.codigo, sucursalSeleccionada).then((data) => {
        console.log(data)
        if (typeof data === 'number') {
          toast.dismiss(toastLoading)
          toast.error('No se encontró el producto')
          setCargando(false)
          return
        } else {
          console.log('hola')
          setProductos(data as ProductosConStock[])
          setCargando(false)
          toast.dismiss(toastLoading)
          return
        }
      })
    } else {
      obtenerFiltrados(filtros, sucursalSeleccionada).then((data) => {
        // limpiarFiltros()
        if (typeof data !== 'number') {
          console.log('hola')
          setProductos(data)
          toast.dismiss(toastLoading)
        }
      })
    }
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
              <legend className="fieldset-legend"> Codigo Producto Exacto:</legend>
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
            //@ts-ignore No debería ser nulo
            document.getElementById('formBusquedaProductos').requestSubmit()
          }}
        >
          Buscar
        </button>
        <button className="btn btn-warning" onClick={() => limpiarFiltros()}>
          Limpiar Filtros
        </button>
      </div>
      <div className="divider"></div>
      <div>LISTA DE PRODUCTOS</div>
      <div>
        {productos && !cargando ? (
          <table className="table outline-1">
            <th>Código</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>SubCategoría</th>
            <th>Marca</th>
            <th>Proveedor</th>
            <th>Stock</th>
            <th>Listado</th>
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
                              )?.Descripcion
                            : subCategorias.find(
                                (subCategoria) => subCategoria.id === producto.Producto.SubCategoria
                              )?.Descripcion
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
                        {producto.Producto.Dado_de_baja ? (
                          <span className="text-red-400"> No listado </span>
                        ) : (
                          <span className="text-green-400"> Listado </span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn btn-warning btn-soft tooltip"
                            data-tip="Editar Producto"
                            onClick={() => {
                              openModals(producto.Producto, setEditarProducto)
                            }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-error btn-soft tooltip"
                            data-tip="Eliminar Producto"
                            onClick={() => {
                              openModals(producto.Producto, setEliminarProducto)
                            }}
                          >
                            <Trash size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-info btn-soft tooltip"
                            data-tip="Agregar Stock"
                            onClick={() => {
                              openModals(producto.Producto, setAumentarStock)
                            }}
                          >
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
      <Modal
        Component={() => (
          <AumentarStock
            onClose={(exito?: boolean) => {
              setAumentarStock(false)
              if (exito) {
                console.log('Eliminado')
                limpiarFiltros()
              }
            }}
          />
        )}
        mainTitle="Aumentar Stock Producto"
        onClose={() => {
          setAumentarStock(false)
        }}
        open={aumentarStock}
      />
      <Modal
        Component={() => (
          <EliminarProducto
            onClose={(exito?: boolean) => {
              setEliminarProducto(false)
              if (exito) {
                console.log('Eliminado')
                limpiarFiltros()
              }
            }}
          />
        )}
        mainTitle="Eliminar Producto"
        onClose={() => {
          setEliminarProducto(false)
        }}
        open={eliminarProducto}
      />
      <Modal
        Component={() => (
          <EditarProducto
            onClose={(exito?: boolean) => {
              setEditarProducto(false)
              if (exito) {
                console.log('Eliminado')
                limpiarFiltros()
              }
            }}
          />
        )}
        mainTitle="Editar Producto"
        onClose={() => {
          setEditarProducto(false)
        }}
        open={editarProducto}
      />
    </>
  )
}
