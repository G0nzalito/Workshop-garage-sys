import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
import { Pencil, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: 260
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

type Modelo = Database['public']['Tables']['Modelos']['Row']
type Vehiculo = Database['public']['Tables']['Vehiculo']['Row']

export default function BusquedaVehiculo(): JSX.Element {
  const [formdata, setFormData] = useState({
    patente: '',
    marca: 0,
    modelo: 0,
    // año: 0,
    // kilometros: 0,
    motor: ''
  })

  const { marcasVehiculos, modelos, clientes } = useConsts()

  const [marca, setMarca] = useState(null)
  const [modelo, setModelo] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [modelosLocal, setModelosLocal] = useState<Modelo[]>([])

  const [vehiculos, setVehiculos] = useState<Vehiculo[] | null>(null)
  const [cargando, setCargando] = useState(false)

  const handleChange = (e): void => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSelectChange = (selectedOption, setState, name): void => {
    setState(selectedOption)
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption.value
    }))
  }

  const handleFilter = (e): void => {
    e.preventDefault()
    console.log(formdata)
  }

  const limpiarFiltros = (): void => {
    setFormData({
      patente: '',
      marca: 0,
      modelo: 0,
      // año: 0,
      // kilometros: 0,
      motor: ''
    })
    setMarca(null)
    setModelo(null)
    setCliente(null)
  }

  useEffect(() => {
    setModelosLocal(modelos.filter((modelo) => modelo.Marca === formdata.marca))
  }, [marca])

  // console.log(vehiculos ? 'Vehiculos cargados' : 'No se cargaron vehiculos')

  return (
    <>
      <div className="">
        <h2 className="">
          <span className="badge badge-soft badge-info text-lg italic">
            Criterios de busqueda:{' '}
          </span>
        </h2>
        <div className="flex gap-2">
          <form onSubmit={handleFilter} className="flex flex-wrap gap-3" id="formBusquedaVehiculos">
            <fieldset>
              <legend className="fieldset-legend"> Patente Vehículo:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa la patente a buscar..."
                name="patente"
                onChange={handleChange}
                value={formdata.patente}
              />
            </fieldset>
            {/* <fieldset>
              <legend className="fieldset-legend"> Marca:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa la descripción..."
                name="descripcion"
                onChange={handleChange}
                value={formdata.descripcion}
              />
            </fieldset> */}
            <fieldset>
              <legend className="fieldset-legend"> Cliente:</legend>
              <Select
                name="Cliente"
                options={clientes.map((cliente) => {
                  return {
                    value: cliente.id,
                    label: `${cliente.Nombre} ${cliente.Numero_Documento === -1 ? ` ` : `(${cliente.Numero_Documento} - ${cliente.Tipo_Documento === 2 ? 'CUIT' : 'DNI'})`}`
                  }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setCliente, 'cliente')
                }}
                value={cliente}
                placeholder="Selecciona un cliente..."
                styles={customStyles}
              ></Select>
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Marca:</legend>
              <Select
                name="Marca"
                options={marcasVehiculos.map((marca) => {
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
            <fieldset className={modelosLocal.length === 0 ? 'hidden' : ''}>
              <legend className="fieldset-legend"> Modelo:</legend>
              <Select
                name="modelo"
                options={modelosLocal.map((modelo) => {
                  return { value: modelo.id, label: modelo.Nombre }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setModelo, 'modelo')
                }}
                value={modelo}
                placeholder="Selecciona un modelo..."
                styles={customStyles}
              ></Select>
            </fieldset>
            {/* <fieldset>
              <legend className="fieldset-legend"> Año:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa el año del vehiculo..."
                name="año"
                onChange={handleChange}
                value={formdata.año}
              />
            </fieldset> */}
            {/* <fieldset>
              <legend className="fieldset-legend"> Kilometros:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa los kilometros vehiculo..."
                name="kilometros"
                onChange={handleChange}
                value={formdata.kilometros}
              />
            </fieldset> */}
            <fieldset>
              <legend className="fieldset-legend"> Motor:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa el motor  del vehiculo..."
                name="motor"
                onChange={handleChange}
                value={formdata.motor}
              />
            </fieldset>
          </form>
        </div>
      </div>
      <div className="flex justify-end items-end gap-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            //@ts-ignore No debería ser nulo
            document.getElementById('formBusquedaVehiculos').requestSubmit()
          }}
        >
          Buscar
        </button>
        <button className="btn btn-warning" onClick={() => limpiarFiltros()}>
          Limpiar Filtros
        </button>
      </div>
      <div className="divider"></div>
      <div>LISTA DE VEHICULOS</div>
      <div>
        {vehiculos && !cargando ? (
          <table className="table outline-1">
            <th>Patente</th>
            <th>Marca</th>
            <th>Cliente</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Kilometros</th>
            <th>Motor</th>
            <th>Acciones</th>
            <tbody>
              {vehiculos.length > 0 ? (
                vehiculos.map((vehiculo) => {
                  return (
                    <tr key={vehiculo.id}>
                      <td>{vehiculo.Patente}</td>
                      <td>{'Ya te guardo'}</td>
                      <td>{vehiculo.Marca}</td>
                      <td>{vehiculo.Modelo}</td>
                      <td>{vehiculo.Año}</td>
                      <td>{vehiculo.Kilometros}</td>
                      <td>{vehiculo.Motor}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn btn-warning btn-soft tooltip"
                            data-tip="Editar Producto"
                            // onClick={() => {
                            //   openModals(vehiculo.Producto, setEditarProducto)
                            // }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn btn-error btn-soft tooltip"
                            data-tip="Eliminar Producto"
                            // onClick={() => {
                            //   openModals(vehiculo.Producto, setEliminarProducto)
                            // }}
                          >
                            <Trash size={16} />
                          </button>
                          {/* <button
                            type="button"
                            className="btn btn-info btn-soft tooltip"
                            data-tip="Agregar Stock"
                            onClick={() => {
                              openModals(vehiculo.Producto, setAumentarStock)
                            }}
                          >
                            <PlusCircle size={16} />
                          </button> */}
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
            <h2>Realize una busqueda filtrada para encontrar los vehículos</h2>
          </div>
        )}
      </div>
    </>
  )
}

