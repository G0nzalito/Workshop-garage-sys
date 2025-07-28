import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
import { BadgeCheck, CirclePlus, PlusCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'
import { createODT } from '../../../../servicies/ODTService'
import CreateTipoDocumento from '@renderer/components/Clientes/TiposDocumento/CreateTipoDocumento'
import { getVehiculosFiltrados } from '../../../../servicies/vehiculosService'
import {
  getProductoByCodigo,
  hayStockParaVenta,
  obtenerStockProductos
} from '../../../../servicies/productosService'

type formDataNuevoCliente = {
  Cliente: string
  Patente: string
  Razon: string
}

type Vehiculo = Database['public']['Tables']['Vehiculo']['Row']
type VehiculoAMostrar = Omit<Vehiculo, 'Cliente'> & { Cliente: string }
type Producto = Database['public']['Tables']['Productos']['Row']
type DetallesOrdenAInsertar = Database['public']['Tables']['Consumos Stock']['Insert']
// type StockAActualizar = Database['public']['Tables']['Stock']['Update']

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

export default function NuevaODT(): JSX.Element {
  const [formData, setFormData] = useState<formDataNuevoCliente>({
    Cliente: '',
    Patente: '',
    Razon: ''
  })

  const [formDataDetail, setFormDataDetail] = useState({
    Codigo: '',
    Cantidad: ''
  })

  const [cesta, setCesta] = useState<
    { Producto: Producto; cantidad: number; stockMaximo: number }[]
  >([])

  const { tiposDocumento, clientes, sucursalSeleccionada } = useConsts()
  const [Vehiculo, setVehiculo] = useState()
  const [Cliente, setCliente] = useState()

  const [vehiculosDeCliente, setVehiculosDeCliente] = useState<VehiculoAMostrar[]>([])

  const handleChange = (e): void => {
    const { name, value, type } = e.target

    if (type === 'number' || type === 'radio') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10)
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleDetailChange = (e): void => {
    const { name, value, type } = e.target

    if (type === 'number' || type === 'radio') {
      setFormDataDetail((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10)
      }))
    } else {
      setFormDataDetail((prevData) => ({
        ...prevData,
        [name]: value.toUpperCase()
      }))
    }
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName): void => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = async (): Promise<void> => {
    console.log('Form Data:', formData)

    const camposOpcionales = ['Razon']
    let falta = false

    for (const key in formData) {
      if (
        !camposOpcionales.includes(key) &&
        (formData[key] === '' ||
          formData[key] === 'Falta' ||
          formData[key] === 0 ||
          formData[key] === -1 ||
          Number.isNaN(formData[key]))
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
      const toastEspera = toast.loading('Creando Orden', {
        description: 'Creando nueva orden de trabajo'
      })

      const detallesOrden: DetallesOrdenAInsertar[] = []

      for (const item of cesta) {
        detallesOrden.push({
          Cantidad: item.cantidad,
          Producto: item.Producto.Codigo,
          SubTotal: item.Producto.Precio * item.cantidad,
          Descripcion: item.Producto.Descripcion,
          Sucursal: sucursalSeleccionada
        })
      }

      const respuesta = await createODT(
        parseInt(formData.Cliente.split('-')[1]),
        parseInt(formData.Cliente.split('-')[0]),
        formData.Patente,
        formData.Razon,
        detallesOrden
      )
      toast.dismiss(toastEspera)
      if (typeof respuesta === 'string') {
        if (respuesta === 'Error de validación') {
          toast.error('Error de Validación', {
            description: 'Verifique los campos ingresados',
            duration: 5000,
            icon: <X />
          })
        } else {
          toast.error('Error desconocido', {
            description: `Contactar al programador inmediatamente`,
            duration: 5000,
            icon: <X />
          })
          console.log('Error al crear la orden:', respuesta)
        }
      } else {
        toast.success('Orden Agregada', {
          description: `Orden de trabajo creada exitosamente`,
          duration: 5000,
          icon: <BadgeCheck />
        })
        limpiarCampos()
      }
    }
  }

  const handleAddDetail = (data): void => {
    console.log('Datos del detalle:', data)
    try {
      if (parseFloat(data.Cantidad) < 0) {
        toast.error('Cantidad invalida', {
          description: 'No intente agregar cantidad negativa de un producto',
          duration: 3000
        })
        return
      }
      //@ts-ignore no va a ser nulo, no seas bobo
      getProductos(data).then(() => {
        console.log('Producto agregado')
      })
      setFormDataDetail({
        Codigo: '',
        Cantidad: ''
      })
    } catch (err) {
      console.error(err)
    }
  }

  const getProductos = async (data): Promise<void> => {
    const toastLoading = toast.loading('Cargando producto')
    try {
      const itemExistente = cesta.find((item) => item.Producto.Codigo === data.Codigo)

      if (itemExistente) {
        if (
          parseFloat(itemExistente.cantidad.toString()) + parseFloat(data.Cantidad) >
          itemExistente.stockMaximo
        ) {
          toast.error('No hay stock suficiente', {
            description: 'No se puede agregar el producto',
            duration: 3000
          })
          return
        }

        setCesta(
          cesta.map((item) => {
            if (item.Producto.Codigo === data.Codigo) {
              return {
                ...item,
                Producto: item.Producto,
                cantidad: parseFloat(item.cantidad.toString()) + parseFloat(data.Cantidad)
              }
            }
            return item
          })
        )
        toast.dismiss(toastLoading)
        toast.success('Producto agregado con exito', {
          description: 'Figura en la tabla',
          duration: 3000
        })
        return
      }

      const producto: Producto = await getProductoByCodigo(data.Codigo, sucursalSeleccionada)

      if (producto) {
        try {
          const hayStock = await hayStockParaVenta(
            producto.Codigo,
            data.Cantidad,
            sucursalSeleccionada
          )
          if (hayStock) {
            console.log('Sucursal en componente: ', sucursalSeleccionada)
            const stock = (await obtenerStockProductos(data.Codigo, sucursalSeleccionada))[0]
            if (cesta.length > 0) {
              setCesta([
                ...cesta,
                { Producto: producto, cantidad: data.Cantidad, stockMaximo: stock.Cantidad }
              ])
            } else {
              setCesta([
                { Producto: producto, cantidad: data.Cantidad, stockMaximo: stock.Cantidad }
              ])
            }
            toast.dismiss(toastLoading)
            toast.success('Producto agregado con exito', {
              description: 'Figura en la tabla',
              duration: 3000
            })
          }
        } catch (noProductos) {
          toast.dismiss(toastLoading)
          console.error(noProductos)
          toast.error('No hay stock suficiente', {
            description: 'No se puede agregar el producto',
            duration: 3000
          })
        }
      }
    } catch (err) {
      toast.dismiss(toastLoading)
      console.error(err)
      toast.error('Producto no encontrado', {
        description: 'No se puede agregar el producto',
        duration: 3000
      })
    }
  }

  const handleKeyDown = (e): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('This will not do anything')
    }
  }

  const limpiarCampos = (): void => {
    setFormData({
      Cliente: '',
      Patente: '',
      Razon: ''
    })
    //@ts-ignore El valor esta bien asignado
    setCliente({ value: 0, label: 'Seleccione un Cliente' })
    //@ts-ignore El valor esta bien asignado
    setVehiculo({ value: 0, label: 'Seleccione un Vehículo' })
    setCesta([])
    setFormDataDetail({
      Codigo: '',
      Cantidad: ''
    })
    setVehiculosDeCliente([])
  }

  useEffect(() => {
    getVehiculosFiltrados(
      undefined,
      undefined,
      undefined,
      parseInt(formData.Cliente.split('-')[1]),
      parseInt(formData.Cliente.split('-')[0])
    ).then((data) => {
      setVehiculosDeCliente(data)
    })
  }, [Cliente])

  return (
    <div className="flex flex-col p-4" onKeyDown={handleKeyDown}>
      <h1 className="text-lg badge badge-info badge-soft">Iniciar nueva orden: </h1>
      {/* <span className='loading loading-bars loading-md'></span> */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="grid grid-cols-[180px_1fr_auto] gap-y-4 p-4 max-w-3xl"
      >
        {/* Nombre y Apellido del cliente */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Cliente:</span>
        <div className="flex flex-col">
          <Select
            name="cliente"
            options={clientes
              .filter((cliente) => cliente.id !== 0 && !cliente.Dado_de_baja)
              .map((cliente) => {
                return {
                  value: `${cliente.Numero_Documento}-${cliente.Tipo_Documento}`,
                  label: `${cliente.Nombre} (${cliente.Numero_Documento} - ${
                    tiposDocumento.find((tipo) => tipo.id === cliente.Tipo_Documento)?.Nombre ||
                    'Desconocido'
                  })`
                }
              })}
            onChange={(e) => handleSelectChange(e, setCliente, 'Cliente')}
            value={Cliente}
            styles={customStyles}
            placeholder="Seleccione un Cliente"
            className="w-full"
          />
          {formData.Cliente === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">El nombre es obligatorio</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Vehiculo */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Vehiculo:</span>
        <div className="flex flex-col">
          <Select
            name="Vehiculo"
            options={vehiculosDeCliente.map((vehiculo) => {
              return {
                value: vehiculo.Patente,
                label: `${vehiculo.Patente} - (${vehiculo.Modelo})`
              }
            })}
            onChange={(e) => handleSelectChange(e, setVehiculo, 'Patente')}
            value={Vehiculo}
            styles={customStyles}
            placeholder="Seleccione un vehículo"
            className="w-full"
          />
          {formData.Patente === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar un vehículo</span>
          )}
        </div>
        <div className="pl-2 self-center">
          {/* <button
            type="button"
            className="btn btn-sm btn-success btn-soft"
            //@ts-ignore el objeto es un modal que dentro de la propia pagina me incitan a usarlo así
            onClick={() => document.getElementById('NuevoTipoDocumento').showModal()}
          >
            <PlusCircle size={20} />
          </button> */}
        </div>

        {/* Numero de documento */}
        <span className="fieldset-legend text-right pr-20 self-center font-medium">
          Razón de la orden:
        </span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Razon"
            className="input input-bordered outline-1 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Ingrese la razón de la orden"
            onChange={handleChange}
          />
        </div>
        <div className="pl-2 self-center"></div>

        <span className="fieldset-legend text-right self-center font-medium"></span>
        <div className="flex flex-col">
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cesta.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.Producto.Codigo}</td>
                    <td>{detalle.cantidad}</td>
                    <td>${detalle.Producto.Precio * detalle.cantidad}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-error btn-sm btn-soft"
                        onClick={() => {
                          setCesta((prevDetalles) => prevDetalles.filter((_, i) => i !== index))
                        }}
                      >
                        <X size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <form
                      id="formVenta"
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleAddDetail(formDataDetail)
                      }}
                    >
                      <input
                        type="text"
                        name="Codigo"
                        className="input input-bordered outline-1"
                        placeholder="Codigo de producto"
                        value={formDataDetail.Codigo}
                        form="formVenta"
                        onChange={handleDetailChange}
                      />
                    </form>
                  </td>
                  <td>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleAddDetail(formDataDetail)
                      }}
                    >
                      <input
                        type="number"
                        name="Cantidad"
                        className="input input-bordered outline-1 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        placeholder="Cantidad"
                        form="formVenta"
                        value={formDataDetail.Cantidad}
                        onChange={handleDetailChange}
                      />
                    </form>
                  </td>
                  <td></td>
                </tr>
                <tr key={-1}>
                  <td></td>
                  <td>
                    <button
                      className="btn btn-success btn-sm btn-soft"
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddDetail(formDataDetail)
                      }}
                    >
                      <PlusCircle size={20} />
                      <span>Agregar detalle</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="pl-2 self-center"></div>

        <div className="col-span-2 flex justify-end mt-2">
          <button type="submit" className="btn btn-success btn-soft">
            Agregar Orden
          </button>
        </div>
      </form>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog id="NuevoTipoDocumento" className="modal">
        <div className="modal-box">
          <div className="flex items-center justify-between mb-4">
            <div className="badge badge-soft badge-success">
              <span className="font-bold italic text-3xl">Nuevo Tipo de Documento</span>
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
          <div className="flex flex-col items-center justify-center p-4">
            <CreateTipoDocumento />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

