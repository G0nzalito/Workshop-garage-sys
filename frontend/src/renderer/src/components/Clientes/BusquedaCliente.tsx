import { getClientesByFiltros } from '../../../../servicies/clientesService'
import { Database } from '@/src/types/database.types'
import EditarCliente from '@renderer/components/Clientes/AccionesCliente/EditarCliente'
import EliminarCliente from '@renderer/components/Clientes/AccionesCliente/EliminarCliente'
import { useConsts } from '@renderer/Contexts/constsContext'
import { Pencil, Trash, X } from 'lucide-react'
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

interface formDataCliente {
  tipoDocumento: number
  numeroDocumento: number
  nombre: string | undefined
  numeroSocio: number
}

type Cliente = Database['public']['Tables']['Cliente']['Row']

export default function BusquedaCliente(): JSX.Element {
  const [formdata, setFormData] = useState<formDataCliente>({
    tipoDocumento: 0,
    numeroDocumento: 0,
    nombre: '',
    numeroSocio: 0
  })

  const { tiposDocumento, clienteSeleccionado, setClienteSeleccionado } = useConsts()

  const [clientes, setClientes] = useState<Cliente[] | null>(null)
  const [tipoDocumento, setTipoDocumento] = useState(null)

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

  const handleSelectChange = (selectedOption, setState, name): void => {
    setState(selectedOption)
    setFormData((prevState) => ({
      ...prevState,
      [name]: selectedOption.value
    }))
  }

  const handleFilter = (e): void => {
    e.preventDefault()

    formdata.nombre === '' ? (formdata.nombre = undefined) : formdata.nombre

    const toastLoading = toast.loading('Cargando vehiculos...')
    getClientesByFiltros(
      formdata.tipoDocumento,
      formdata.numeroDocumento,
      formdata.nombre,
      formdata.numeroSocio
    )
      .then((data) => {
        console.log(data)
        if (typeof data === 'string') {
          toast.dismiss(toastLoading)
          toast.error('Error al cargar los clientes', {
            description: 'Contacte al administrador de red inmediatamente',
            duration: 5000,
            icon: <X />
          })
          return
        }
        setClientes(data)
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
            onSubmit={handleFilter}
            onReset={limpiarFiltros}
            className="flex flex-wrap gap-3"
            id="formBusquedaClientes"
          >
            <fieldset>
              <legend className="fieldset-legend"> Tipo de cliente:</legend>
              <Select
                name="tipoDocumento"
                options={tiposDocumento
                  .filter((tiposDocumento) => tiposDocumento.id !== -1)
                  .map((tiposDocumento) => {
                    return {
                      value: tiposDocumento.id,
                      label: `${tiposDocumento['Tipo de cliente']}  (${tiposDocumento.Nombre})`
                    }
                  })}
                onChange={(e) => {
                  handleSelectChange(e, setTipoDocumento, 'tipoDocumento')
                }}
                value={tipoDocumento}
                placeholder="Selecciona una cuenta..."
                styles={customStyles}
              ></Select>
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Numero Documento:</legend>
              <input
                type="number"
                className="input input-md outline-1 w-60 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Ingresa el numero a buscar..."
                name="numeroDocumento"
                onChange={handleChange}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Nombre:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa el nombre a buscar..."
                name="nombre"
                onChange={handleChange}
                value={formdata.nombre}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Numero de socio:</legend>
              <input
                type="number"
                className="input input-md outline-1 w-60 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Ingresa el numero de socio a buscar..."
                name="numeroSocio"
                onChange={handleChange}
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
    </>
  )
}

