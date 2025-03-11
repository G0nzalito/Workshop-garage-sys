import { useConsts } from '@renderer/Contexts/constsContext'
import { useEffect, useState } from 'react'
import { getMarcasProductos } from '../../../../servicies/marcaProductoService.js'
import { getProveedoresActivos } from '../../../../servicies/proveedoresService.js'
import {
  getCategoriasProductos,
  getSubCategoriasProductosByCategoria
} from '../../../../servicies/categoriasYSubCategoriasService.js'
import { Database } from '@/src/types/database.types.js'
import Select from 'react-select'

type SubCategoria = Database['public']['Tables']['SubCategorias']['Row']

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
}

export default function ProductosMain(): JSX.Element {
  const {
    marcasProductos,
    setMarcasProductos,
    proveedores,
    setProveedores,
    categorias,
    setCategorias
  } = useConsts()
  const [marca, setMarca] = useState()
  const [proveedor, setProveedor] = useState()
  const [categoria, setCategoria] = useState()
  const [subcategoriaSelec, setSubcategoriaSelec] = useState()
  const [subCategorias, setSubCategorias] = useState<SubCategoria[]>([])

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,

      [name]: value
    }))
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
    proveedor: 0
  })

  useEffect(() => {
    getMarcasProductos().then((data) => {
      setMarcasProductos(data)
    })
    getProveedoresActivos().then((data) => {
      setProveedores(data)
    })
    getCategoriasProductos().then((data) => {
      setCategorias(data)
    })
  }, [])

  useEffect(() => {
    if (formdata.categoria === 0) return
    getSubCategoriasProductosByCategoria(formdata.categoria).then((data) => {
      setSubCategorias(data)
    })
  }, [categoria])

  const limiparFiltros = () => {
    setFormData({
      descripcion: '',
      marca: 0,
      categoria: 0,
      subcategoria: 0,
      proveedor: 0
    })
    //@ts-ignore si funciona, dejemoslo como está
    setMarca({ value: 0, label: 'Selecciona una marca...' })
    //@ts-ignore si funciona, dejemoslo como está
    setProveedor({ value: 0, label: 'Selecciona un proveedor...' })
    //@ts-ignore si funciona, dejemoslo como está
    setCategoria({ value: 0, label: 'Selecciona una categoría...' })
    //@ts-ignore si funciona, dejemoslo como está
    setSubcategoriaSelec({ value: 0, label: 'Selecciona una subcategoría...' })
  }

  const handleFilter = (e) => {
    e.preventDefault()
    console.log(formdata)
  }

  return (
    <div className="flex w-full flex-col bg-base-100 text-white gap-2 p-4">
      <div className="flex flex-col gap-2">
        <h2 className="">
          <span className="badge badge-soft badge-info text-lg italic">
            Criterios de busqueda:{' '}
          </span>
        </h2>
        <div className="flex gap-2">
          <form onSubmit={handleFilter} className="flex flex-row gap-3" id="formBusquedaProductos">
            <fieldset>
              <legend className="fieldset-legend"> Descripción:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa la descripción..."
                name="descripcion"
                onChange={handleChange}
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
            <fieldset className={subCategorias.length === 0 ? 'hidden' : ''}>
              <legend className="fieldset-legend"> SubCategoria:</legend>
              <Select
                name="SubCategoria"
                options={subCategorias.map((subcategoria) => {
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
        <button className="btn btn-accent" onClick={() => limiparFiltros()}>
          Limpiar Filtros
        </button>
      </div>
      <div className="divider"></div>
      <div>LISTA DE PRODUCTOS</div>
      <div>
        <table className='table'>
          <th>Código</th>
          <th>Descripción</th>  
          <th>Precio</th>  
          <th>Categoría</th>  
          <th>SubCategoría</th>  
          <th>Marca</th>  
          <th>Proveedor</th>
          <th>Stock</th>  
        </table> 
      </div>
    </div>
  )
}

