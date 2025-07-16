import {
  getVehiculoPorPatente,
  getVehiculosFiltrados
} from '../../../../servicies/vehiculosService'
import { Database } from '@/src/types/database.types'
import EditarVehiculo from '@renderer/components/Vehiculos/AccionesVehiculo/EditarVehiculo'
import { useConsts } from '@renderer/Contexts/constsContext'
import { Pencil, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'

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
type VehiculoAMostrar = Omit<Vehiculo, 'Cliente'> & { Cliente: string }

export default function BusquedaVehiculo(): JSX.Element {
  const [formdata, setFormData] = useState({
    patente: '',
    marca: 0,
    modelo: 0,
    // año: 0,
    // kilometros: 0,
    motor: '',
    cliente: ''
  })

  const { marcasVehiculos, modelos, clientes, setVehiculoSeleccionado, vehiculoSeleccionado } =
    useConsts()

  const [marca, setMarca] = useState(null)
  const [modelo, setModelo] = useState(null)
  const [cliente, setCliente] = useState(null)
  const [modelosLocal, setModelosLocal] = useState<Modelo[]>([])

  const [vehiculos, setVehiculos] = useState<VehiculoAMostrar[] | null>(null)
  const [cargando, setCargando] = useState(false)

  const [EditarVehiculoKey, setEditarVehiculoKey] = useState(0)

  const handleChange = (e): void => {
    const { name, value, type } = e.target
    if (name === 'patente') {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value.toUpperCase() // Convertir a mayúsculas al ingresar la patente
      }))
    } else {
      if (type === 'number') {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value === '' ? -1 : parseInt(value, 10) // Convertir a número
        }))
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value
        }))
      }
    }
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

    const toastLoading = toast.loading('Cargando vehiculos...')
    if (formdata.patente !== '') {
      getVehiculoPorPatente(formdata.patente).then((data) => {
        setVehiculos([data])
        setCargando(false)
        toast.dismiss(toastLoading)
        toast.success('Vehiculo cargado correctamente')
      })
    } else {
      getVehiculosFiltrados(
        formdata.marca !== 0 ? formdata.marca : undefined,
        formdata.modelo !== 0 ? formdata.modelo : undefined,
        formdata.motor !== '' ? formdata.motor : undefined,
        formdata.cliente !== '' ? parseInt(formdata.cliente.split('-')[0]) : undefined,
        formdata.cliente !== '' ? parseInt(formdata.cliente.split('-')[1]) : undefined
      )
        .then((data) => {
          console.log(data)
          setVehiculos(data)
          setCargando(false)
          toast.dismiss(toastLoading)
          toast.success('Vehiculos cargados correctamente')
        })
        .catch((error) => {
          console.error('Error al cargar los vehiculos:', error)
          toast.dismiss(toastLoading)
          toast.error('Error al cargar los vehiculos')
        })
    }
  }

  const limpiarFiltros = (): void => {
    setFormData({
      patente: '',
      marca: 0,
      modelo: 0,
      // año: 0,
      // kilometros: 0,
      motor: '',
      cliente: ''
    })
    setMarca(null)
    setModelo(null)
    setCliente(null)
    setVehiculos(null)
  }

  useEffect(() => {
    setModelosLocal(modelos.filter((modelo) => modelo.Marca === formdata.marca))
  }, [marca])

  // console.log(vehiculos ? 'Vehiculos cargados' : 'No se cargaron vehiculos')

  console.log(EditarVehiculoKey)

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
            <fieldset>
              <legend className="fieldset-legend"> Cliente:</legend>
              <Select
                name="Cliente"
                options={clientes
                  .filter((cliente) => cliente.id !== 0)
                  .map((cliente) => {
                    return {
                      value: `${cliente.Tipo_Documento}-${cliente.Numero_Documento}`,
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
                      <td>
                        {vehiculo.Cliente === 'Sin dueño'
                          ? 'Sin dueño'
                          : `${
                              clientes.find(
                                (cliente) =>
                                  cliente.Tipo_Documento ===
                                    parseInt(vehiculo.Cliente.split('-')[0], 10) &&
                                  cliente.Numero_Documento ===
                                    parseInt(vehiculo.Cliente.split('-')[1], 10)
                              )?.Nombre
                            }`}
                      </td>
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
                            data-tip="Editar Vehículo"
                            onClick={() => {
                              setVehiculoSeleccionado(vehiculo)
                              //@ts-ignore siempre existe el modal
                              document.getElementById('EditarVehiculo').showModal()
                            }}
                          >
                            <Pencil size={16} />
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
            <h2>Realize una busqueda filtrada para encontrar los vehículos</h2>
          </div>
        )}
      </div>
      <dialog
        id="EditarVehiculo"
        className="modal"
        onClose={(): void => {
          setVehiculoSeleccionado(null)
          // formData.Marca = 0
        }}
      >
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-soft badge-success">
              <span className="font-bold italic text-3xl">Editar Vehículo</span>
            </div>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
            </div>
          </div>
          {vehiculoSeleccionado !== null && <EditarVehiculo />}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

