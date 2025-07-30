import { getVehiculosFiltrados } from '../../../../servicies/vehiculosService'
import { getClientesByFiltros } from '../../../../servicies/clientesService'
import { Database } from '@/src/types/database.types'
import EditarCliente from '@renderer/components/Clientes/AccionesCliente/EditarCliente'
import EliminarCliente from '@renderer/components/Clientes/AccionesCliente/EliminarCliente'
import { useConsts } from '@renderer/Contexts/constsContext'
import { Pencil, Trash, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'
import { Calendar } from '@/components/ui/calendar'
import { es } from 'react-day-picker/locale'
import React from 'react'

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

interface formDataCliente {
  cliente: string
  patente: string
  fecha: string
  activas: boolean
}

type Cliente = Database['public']['Tables']['Cliente']['Row']
type Vehiculo = Database['public']['Tables']['Vehiculo']['Row']

export default function BusquedaODT(): JSX.Element {
  const [formdata, setFormData] = useState<formDataCliente>({
    cliente: '',
    patente: '',
    fecha: '',
    activas: false
  })

  const {
    tiposDocumento,
    clienteSeleccionado,
    setClienteSeleccionado,
    clientes,
    modelos,
    vehiculos
  } = useConsts()

  // const [clientes, setClientes] = useState<Cliente[] | null>(null)
  const [Cliente, setCliente] = useState(null)
  const [Vehiculo, setVehiculo] = useState(null)
  const [vehiculosDeCliente, setVehiculosDeCliente] = useState<Vehiculo[]>([])

  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const [cargando, setCargando] = useState(false)

  const [editarClientekey, setEditarClienteKey] = useState(0)

  const handleChange = (e): void => {
    const { name, value, type } = e.target
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

  const handleSelectDate = (e) => {
    console.log('Fecha seleccionada:', e)
    setFormData((prev) => ({
      ...prev,
      fecha: e ? e.toISOString().split('T')[0] : ''
    }))
  }

  const handleSelectChange = (selectedOption, setState, name): void => {
    setState(selectedOption)
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption.value
    }))
  }

  // const handleFilter = (e): void => {
  //   e.preventDefault()

  //   formdata.nombre === '' ? (formdata.nombre = undefined) : formdata.nombre

  //   const toastLoading = toast.loading('Cargando vehiculos...')
  //   getClientesByFiltros(
  //     formdata.tipoDocumento,
  //     formdata.numeroDocumento,
  //     formdata.nombre,
  //     formdata.numeroSocio
  //   )
  //     .then((data) => {
  //       console.log(data)
  //       if (typeof data === 'string') {
  //         toast.dismiss(toastLoading)
  //         toast.error('Error al cargar los clientes', {
  //           description: 'Contacte al administrador de red inmediatamente',
  //           duration: 5000,
  //           icon: <X />
  //         })
  //         return
  //       }
  //       setClientes(data)
  //       setCargando(false)
  //       toast.dismiss(toastLoading)
  //       toast.success('Vehiculos cargados correctamente')
  //     })
  //     .catch((error) => {
  //       console.error('Error al cargar los vehiculos:', error)
  //       toast.dismiss(toastLoading)
  //       toast.error('Error al cargar los vehiculos')
  //     })
  // }

  const limpiarFiltros = (): void => {
    setFormData({
      tipoDocumento: 0,
      numeroDocumento: 0,
      nombre: '',
      numeroSocio: 0
    })
    setTipoDocumento(null)
    setClientes(null)
    setCargando(false)
  }

  useEffect(() => {
    getVehiculosFiltrados(
      undefined,
      undefined,
      undefined,
      parseInt(formdata.cliente.split('-')[0]),
      parseInt(formdata.cliente.split('-')[1])
    ).then((data) => {
      setVehiculosDeCliente(data)
    })
  }, [Cliente])

  // console.log(vehiculos ? 'Vehiculos
  return (
    <>
      <div className="">
        <h2 className="">
          <span className="badge badge-soft badge-info text-lg italic">
            Criterios de busqueda:{' '}
          </span>
        </h2>
        <div className="flex gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
            onReset={limpiarFiltros}
            className="flex flex-wrap gap-3"
            id="formBusquedaClientes"
          >
            <fieldset>
              <legend className="fieldset-legend"> Cliente:</legend>
              <Select
                name="cliente"
                options={clientes
                  .filter((cliente) => cliente.id !== 0 && !cliente.Dado_de_baja)
                  .map((cliente) => {
                    return {
                      value: `${cliente.Tipo_Documento}-${cliente.Numero_Documento}`,
                      label: `${cliente.Nombre} (${cliente.Numero_Documento} - ${
                        tiposDocumento.find((tipo) => tipo.id === cliente.Tipo_Documento)?.Nombre
                      })`
                    }
                  })}
                onChange={(e) => {
                  handleSelectChange(e, setCliente, 'cliente')
                }}
                value={Cliente}
                placeholder="Selecciona un cliente..."
                styles={customStyles}
              ></Select>
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Vehiculo:</legend>
              <Select
                name="patente"
                options={vehiculosDeCliente.map((vehiculo) => {
                  return {
                    value: vehiculo.Patente,
                    label: `${vehiculo.Patente} (${vehiculo.Modelo})`
                  }
                })}
                onChange={(e) => {
                  handleSelectChange(e, setVehiculo, 'patente')
                }}
                value={Vehiculo}
                placeholder="Selecciona un vehiculo..."
                styles={customStyles}
              ></Select>
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> A partir de:</legend>
              <input
                type="date"
                className="input input-md outline-1"
                value={formdata.fecha}
                onClick={() => {
                  //@ts-ignore no va a ser null
                  document.getElementById('IngresarFecha').showModal()
                }}
              />

              {/* <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border bg-base-100"
              /> */}
            </fieldset>
            {/* <fieldset>
              <legend className="fieldset-legend"> Numero de socio:</legend>
              <input
                type="number"
                className="input input-md outline-1 w-60 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Ingresa el numero de socio a buscar..."
                name="numeroSocio"
                onChange={handleChange}
              />
            </fieldset> */}
          </form>
        </div>
      </div>
      <div className="flex justify-end items-end gap-2">
        <button
          className="btn btn-primary"
          onClick={() => {
            //@ts-ignore No debería ser nulo
            document.getElementById('formBusquedaClientes').requestSubmit()
          }}
        >
          Buscar
        </button>
        <input
          type="reset"
          value="Limpiar Filtros"
          className="btn btn-warning"
          form="formBusquedaClientes"
        />
      </div>
      <div className="divider"></div>
      <div>LISTA DE CLIENTES</div>
      <div>
        {clientes && !cargando ? (
          <table className="table outline-1">
            <th>Tipo Cuenta</th>
            <th>Numero Documento</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Numero de socio</th>
            <th>Estado</th>
            <th>Acciones</th>
            <tbody>
              {clientes.length > 0 ? (
                clientes
                  .filter((cliente) => cliente.id !== 0)
                  .map((cliente) => {
                    return (
                      <tr key={cliente.id}>
                        <td>{`${tiposDocumento.find((tipo) => tipo.id === cliente.Tipo_Documento)?.['Tipo de cliente']} - ${tiposDocumento.find((tipo) => tipo.id === cliente.Tipo_Documento)?.['Nombre']} `}</td>
                        <td>{cliente.Numero_Documento.toString().padStart(8, '0')}</td>
                        <td>{cliente.Nombre}</td>
                        <td>{cliente.Telefono ? cliente.Telefono : 'Sin teléfono'}</td>
                        <td>{cliente.Email ? cliente.Email : 'Sin email'}</td>
                        <td>{cliente.Direccion ? cliente.Direccion : 'Sin dirección'}</td>
                        <td>
                          {cliente.Numero_Socio ? cliente.Numero_Socio : 'Sin número de socio'}
                        </td>
                        <td>
                          {cliente.Dado_de_baja ? (
                            <span className="text-red-400">Inactivo</span>
                          ) : (
                            <span className="text-green-400">Activo</span>
                          )}
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="btn btn-warning btn-soft tooltip"
                              data-tip="Editar Cliente"
                              onClick={() => {
                                setClienteSeleccionado(cliente)
                                //@ts-ignore siempre existe el modal
                                document.getElementById('EditarCliente').showModal()
                              }}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-error btn-soft tooltip"
                              data-tip="Eliminar Producto"
                              disabled={cliente.Dado_de_baja}
                              onClick={() => {
                                setClienteSeleccionado(cliente)
                                //@ts-ignore siempre existe el modal
                                document.getElementById('EliminarCliente').showModal()
                              }}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              ) : (
                <tr>
                  <td colSpan={8}>No se encontraron Clientes</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center text-2xl">
            <h2>Realize una busqueda filtrada para encontrar los clientes</h2>
          </div>
        )}
      </div>
      <dialog
        id="EditarCliente"
        className="modal"
        onClose={(): void => {
          setClienteSeleccionado(undefined)
          // formData.Marca = 0
        }}
      >
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-soft badge-success">
              <span className="font-bold italic text-3xl">Editar Cliente</span>
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
          {clienteSeleccionado !== undefined && <EditarCliente setClientes={setClientes} />}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog
        id="EliminarCliente"
        className="modal"
        onClose={(): void => {
          setClienteSeleccionado(undefined)
          // formData.Marca = 0
        }}
      >
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-soft badge-error">
              <span className="font-bold italic text-3xl">Eliminar Cliente</span>
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
          {clienteSeleccionado !== undefined && <EliminarCliente setClientes={setClientes} />}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog
        id="IngresarFecha"
        className="modal"
        onClose={(): void => {
          // formData.Marca = 0
        }}
      >
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-soft badge-success mb-4">
              <span className="font-bold italic text-3xl">A partir de la fecha:</span>
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
          <div className="flex justify-center items-center mb-4">
            <Calendar
              mode="single"
              selected={formdata.fecha ? new Date(formdata.fecha) : undefined}
              onSelect={handleSelectDate}
              className="rounded-lg border bg-base-100"
              classNames={{
                today: 'text-[#ea6943]',
                selected: 'bg-[#262a27] text-[#4da287]'
              }}
              locale={es}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="badge badge-outline badge-info ">
              {date
                ? `Fecha seleccionada: ${new Date(formdata.fecha).toLocaleDateString('es-ES')}`
                : 'Seleccione una fecha'}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                //@ts-ignore no va a ser nulo
                document.getElementById('IngresarFecha').close()
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

