import { getVehiculosFiltrados } from '../../../../servicies/vehiculosService'
import { getClientesByFiltros } from '../../../../servicies/clientesService'
import { Database } from '../../../../types/database.types'
import EditarCliente from '@renderer/components/Clientes/AccionesCliente/EditarCliente'
import EliminarCliente from '@renderer/components/Clientes/AccionesCliente/EliminarCliente'
import { useConsts } from '@renderer/Contexts/constsContext'
import { DollarSign, Info, Pencil, PlusCircle, Trash, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'
import { Calendar } from '@/components/ui/calendar'
import { es } from 'react-day-picker/locale'
import React from 'react'
import { getODTFiltered } from '@/src/servicies/ODTService'
import AgregarDetallesODT from '@renderer/components/Ordenes de trabajo/AgregarDetallesODT'
import AgregarDetallesODTModal from '@renderer/components/Ordenes de trabajo/AccionesODT/AgregarDetallesODTModal'

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
  patente?: string
  fechaDesde?: Date
  fechaHasta?: Date
  finalizadas?: boolean | number
}

type Cliente = Database['public']['Tables']['Cliente']['Row']
type Vehiculo = Database['public']['Tables']['Vehiculo']['Row']
type ODT = Database['public']['Tables']['Ordenes de trabajo']['Row']

export default function BusquedaODT(): JSX.Element {
  const [formdata, setFormData] = useState<formDataCliente>({
    cliente: '',
    patente: '',
    fechaDesde: undefined,
    finalizadas: undefined
  })

  const { tiposDocumento, clientes, ordenDeTrabajoSeleccionada, setOrdenDeTrabajoSeleccionada } =
    useConsts()

  // const [clientes, setClientes] = useState<Cliente[] | null>(null)
  const [Cliente, setCliente] = useState(null)
  const [Vehiculo, setVehiculo] = useState(null)
  const [vehiculosDeCliente, setVehiculosDeCliente] = useState<Vehiculo[]>([])

  const [cesta, setCesta] = useState<
    { Producto: Producto; cantidad: number; stockMaximo: number }[]
  >([])

  const [ordenes, setOrdenes] = useState<ODT[]>()

  // const [date, setDate] = React.useState<Date | undefined>(new Date())

  const [cargando, setCargando] = useState(false)

  const [editarClientekey, setEditarClienteKey] = useState(0)

  const handleChange = (e): void => {
    const { name, value, type } = e.target
    if (type === 'number' || type === 'radio') {
      console.log('Valor del input:', value)
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

  const handleSelectDateFrom = (e) => {
    console.log('Fecha seleccionada:', e)
    setFormData((prev) => ({
      ...prev,
      fechaDesde: e ? e : new Date()
    }))
  }

  const handleSelectDateUntil = (e) => {
    console.log('Fecha seleccionada:', e)
    setFormData((prev) => ({
      ...prev,
      fechaHasta: e ? e : new Date()
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

    //@ts-ignore no te preocupes por los errores, va a funcionar

    console.log('formdata', formdata)

    formdata.finalizadas === 1 ? (formdata.finalizadas = true) : (formdata.finalizadas = false)

    const toastLoading = toast.loading('Cargando órdenes de trabajo...')
    getODTFiltered(
      parseInt(formdata.cliente.split('-')[0]),
      parseInt(formdata.cliente.split('-')[1]),
      formdata.patente,
      formdata.fechaDesde,
      formdata.fechaHasta,
      formdata.finalizadas
    )
      .then((data) => {
        if (typeof data === 'string') {
          toast.dismiss(toastLoading)
          toast.error('Error al cargar las órdenes de trabajo', {
            description: 'Contacte al administrador del sistema',
            duration: 5000,
            icon: <X />
          })
          return
        }
        setCargando(false)
        toast.dismiss(toastLoading)
        toast.success('Órdenes de trabajo cargadas correctamente')
        setOrdenes(data)
        limpiarFiltros()
      })
      .catch((error) => {
        console.error('Error al cargar las órdenes de trabajo:', error)
        toast.dismiss(toastLoading)
        toast.error('Error al cargar las órdenes de trabajo', {
          description: 'Contacte al administrador del sistema',
          duration: 5000,
          icon: <X />
        })
      })
    // const toastLoading = toast.loading('Cargando vehiculos...')
    // getClientesByFiltros(
    //   formdata.tipoDocumento,
    //   formdata.numeroDocumento,
    //   formdata.nombre,
    //   formdata.numeroSocio
    // )
    //   .then((data) => {
    //     console.log(data)
    //     if (typeof data === 'string') {
    //       toast.dismiss(toastLoading)
    //       toast.error('Error al cargar los clientes', {
    //         description: 'Contacte al administrador de red inmediatamente',
    //         duration: 5000,
    //         icon: <X />
    //       })
    //       return
    //     }
    //     setClientes(data)
    //     setCargando(false)
    //     toast.dismiss(toastLoading)
    //     toast.success('Vehiculos cargados correctamente')
    //   })
    //   .catch((error) => {
    //     console.error('Error al cargar los vehiculos:', error)
    //     toast.dismiss(toastLoading)
    //     toast.error('Error al cargar los vehiculos')
    //   })
  }

  const limpiarFiltros = (): void => {
    setFormData({
      cliente: '',
      patente: '',
      fechaDesde: undefined,
      fechaHasta: undefined,
      finalizadas: formdata.finalizadas ? 1 : 0
    })
    setCliente(null)
    setVehiculo(null)
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
            onSubmit={handleFilter}
            onReset={() => {
              setOrdenes(undefined)
              limpiarFiltros()
            }}
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
                value={new Date(formdata.fechaDesde).toLocaleDateString('en-CA')}
                onClick={() => {
                  //@ts-ignore no va a ser null
                  document.getElementById('IngresarFechaDesde').showModal()
                }}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Hasta:</legend>
              <input
                type="date"
                className="input input-md outline-1"
                value={new Date(formdata.fechaHasta).toLocaleDateString('en-CA')}
                onClick={() => {
                  //@ts-ignore no va a ser null
                  document.getElementById('IngresarFechaHasta').showModal()
                }}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> ¿Incluir órdenes finalizadas?</legend>
              <div className="flex justify-center gap-4">
                <input
                  type="radio"
                  name="finalizadas"
                  value={1}
                  className="radio radio-success outline-1"
                  defaultChecked={formdata.finalizadas === 1} // Use 'checked' instead of 'defaultChecked'
                  onChange={handleChange}
                />
                <span> Si </span>
                <input
                  type="radio"
                  name="finalizadas"
                  value={0}
                  className="radio radio-error outline-1"
                  defaultChecked={formdata.finalizadas === 0} // Use 'checked' instead of 'defaultChecked'
                  onChange={handleChange}
                />
                <span> No </span>
              </div>
            </fieldset>
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
        {ordenes && !cargando ? (
          <table className="table outline-1">
            <th>Tipo Cuenta</th>
            <th>Numero Documento</th>
            <th>Nombre</th>
            <th>Patente</th>
            <th>Fecha inicio de orden</th>
            <th>Estado</th>
            <th>Acciones</th>
            <tbody>
              {ordenes.length > 0 ? (
                ordenes.map((orden) => {
                  return (
                    <tr key={orden.id}>
                      <td>
                        {
                          tiposDocumento.find((tipo) => tipo.id === orden.Tipo_Documento_Cliente)?.[
                            'Tipo de cliente'
                          ]
                        }
                      </td>
                      <td>{orden.Numero_Documento_Cliente}</td>
                      <td>
                        {
                          clientes.find(
                            (cliente) =>
                              cliente.Tipo_Documento === orden.Tipo_Documento_Cliente &&
                              cliente.Numero_Documento === orden.Numero_Documento_Cliente
                          )?.Nombre
                        }
                      </td>
                      <td>{orden.Patente_Vehiculo}</td>
                      <td>{new Date(orden.Fecha_creacion).toLocaleDateString('es-AR')}</td>
                      <td>
                        {orden.Completada ? (
                          <span className="badge badge-soft badge-success">Finalizada</span>
                        ) : (
                          <span className="badge badge-soft badge-error">Pendiente</span>
                        )}
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-soft btn-warning btn-sm tooltip"
                          data-tip="Agregar Detalles"
                          onClick={() => {
                            setOrdenDeTrabajoSeleccionada(orden)
                            setEditarClienteKey((prev) => prev + 1)
                            document.getElementById('EditarODT').showModal()
                          }}
                        >
                          <PlusCircle size={16} />
                        </button>
                        <button
                          className={`btn btn-soft ${orden.Completada ? 'btn-info' : 'btn-success'} btn-sm tooltip`}
                          data-tip={`${orden.Completada ? 'Ver Comprobante' : 'Cobrar Orden'}`}
                          onClick={() => {
                            setOrdenDeTrabajoSeleccionada(orden)
                            document.getElementById('EliminarCliente').showModal()
                          }}
                        >
                          {orden.Completada ? <Info size={16} /> : <DollarSign size={16} />}
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8}>No se encontraron Ordenes</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center text-2xl">
            <h2>Realize una busqueda filtrada para encontrar las ordenes</h2>
          </div>
        )}
      </div>
      <dialog
        id="EditarODT"
        className="modal"
        onClose={(): void => {
          setOrdenDeTrabajoSeleccionada(undefined)
          // formData.Marca = 0
        }}
      >
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-soft badge-success">
              <span className="font-bold italic text-3xl">Agregar detalles a orden</span>
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
          {ordenDeTrabajoSeleccionada !== undefined && (
            <>{<AgregarDetallesODTModal cesta={cesta} setCesta={setCesta} />}</>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog
        id="IngresarFechaDesde"
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
              selected={formdata.fechaDesde ? new Date(formdata.fechaDesde) : undefined}
              onSelect={handleSelectDateFrom}
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
              {formdata.fechaDesde
                ? `Fecha seleccionada: ${new Date(formdata.fechaDesde).toLocaleDateString('es-ES')}`
                : 'Seleccione una fecha'}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                //@ts-ignore no va a ser nulo
                document.getElementById('IngresarFechaDesde').close()
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
      <dialog
        id="IngresarFechaHasta"
        className="modal"
        onClose={(): void => {
          // formData.Marca = 0
        }}
      >
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <div className="badge badge-soft badge-success mb-4">
              <span className="font-bold italic text-3xl">Hasta la fecha:</span>
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
              selected={formdata.fechaHasta ? new Date(formdata.fechaHasta) : undefined}
              onSelect={handleSelectDateUntil}
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
              {formdata.fechaHasta
                ? `Fecha seleccionada: ${new Date(formdata.fechaHasta).toLocaleDateString('es-ES')}`
                : 'Seleccione una fecha'}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                //@ts-ignore no va a ser nulo
                document.getElementById('IngresarFechaHasta').close()
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
