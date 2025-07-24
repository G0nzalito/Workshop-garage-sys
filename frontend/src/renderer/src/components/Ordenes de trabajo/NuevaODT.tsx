import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
import { BadgeCheck, PlusCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'
import MarcaYModeloTabs from '@renderer/specificComponents/MarcaYModeloTabs'
import CreateModeloVehiculo from '@renderer/components/Vehiculos/Modelo/NuevoModelo'
import { crearCliente } from '../../../../servicies/clientesService'
import CreateTipoDocumento from '@renderer/components/Clientes/TiposDocumento/CreateTipoDocumento'

type formDataNuevoCliente = {
  Nombre: string
  Tipo_Documento: number
  Numero_Documento: number
  Direccion: string
  Email: string | null
  Telefono: number
  Asociacion?: number | boolean
}

type Modelo = Database['public']['Tables']['Modelos']['Row']
// type StockAActualizar = Database['public']['Tables']['Stock']['Update']
type Detalle = {
  Producto: string
  Cantidad: number
  Descripcion: string
  PrecioXUnidad: number
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

export default function NuevaODT(): JSX.Element {
  const [formData, setFormData] = useState<formDataNuevoCliente>({
    Nombre: '',
    Tipo_Documento: 0,
    Numero_Documento: 0,
    Direccion: '',
    Email: '',
    Telefono: 0,
    Asociacion: 0
  })

  const { tiposDocumento } = useConsts()
  const [TipoDoc, setTipoDoc] = useState()

  const [detallesOrden, setDetallesOrden] = useState<Detalle[]>([])

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

  const handleSelectChange = (selectedOption, setFunction, formDataName): void => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = async (): Promise<void> => {
    const camposOpcionales = ['Direccion', 'Email', 'Telefono', 'Asociacion']
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
      formData.Asociacion === 1 ? (formData.Asociacion = true) : (formData.Asociacion = false)
      formData.Email === '' ? (formData.Email = null) : formData.Email
      console.log('Enviando datos')
      const toastEspera = toast.loading('Agregando Cliente', {
        description: 'Agregando cliente a la base de datos'
      })

      const respuesta = await crearCliente(formData)
      toast.dismiss(toastEspera)
      if (typeof respuesta === 'string') {
        if (respuesta === 'Cliente Duplicado') {
          toast.error('Cliente Duplicado', {
            description: 'El cliente con ese tipo y numero de documento ya existe',
            duration: 5000,
            icon: <X />
          })
        } else {
          toast.error('Error desconocido', {
            description: `Contactar al programador inmediatamente`,
            duration: 5000,
            icon: <X />
          })
          console.log('Error al crear el cliente:', respuesta)
        }
      } else {
        toast.success('Cliente agregado', {
          description: `Cliente ${formData.Nombre} agregado`,
          duration: 6000,
          icon: <BadgeCheck />
        })
        limpiarCampos()
      }
    }
  }

  const limpiarCampos = (): void => {
    setFormData((prevData) => ({
      ...prevData,
      Nombre: '',
      Tipo_Documento: 0,
      Numero_Documento: 0,
      Direccion: '',
      Email: '',
      Telefono: 0,
      Asociacion: formData.Asociacion === true ? 1 : 0
    }))
    //@ts-ignore - No se puede asignar un número a un string
    setTipoDoc({ value: 0, label: 'Seleccione un Tipo de Documento' })
  }

  return (
    <div className="flex flex-col p-4">
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
          <input
            type="text"
            name="Nombre"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese todos los nomberes y apellidos del cliente"
            value={formData.Nombre}
            onChange={handleChange}
          />
          {formData.Nombre === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">El nombre es obligatorio</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Vehiculo */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Vehiculo:</span>
        <div className="flex flex-col">
          <Select
            name="Vehiculo"
            options={tiposDocumento
              .filter((tipo) => tipo.id !== -1)
              .map((Tipo) => {
                return {
                  value: Tipo.id,
                  label: Tipo.Nombre
                }
              })}
            onChange={(e) => handleSelectChange(e, setTipoDoc, 'Tipo_Documento')}
            value={TipoDoc}
            styles={customStyles}
            placeholder="Seleccione un Tipo de Documento"
            className="w-full"
          />
          {formData.Tipo_Documento === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar un Tipo de Documento</span>
          )}
        </div>
        <div className="pl-2 self-center">
          <button
            type="button"
            className="btn btn-sm btn-success btn-soft"
            //@ts-ignore el objeto es un modal que dentro de la propia pagina me incitan a usarlo así
            onClick={() => document.getElementById('NuevoTipoDocumento').showModal()}
          >
            <PlusCircle size={20} />
          </button>
        </div>

        {/* Numero de documento */}
        <span className="fieldset-legend text-right pr-20 self-center font-medium">
          Razón de la orden:
        </span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Numero_Documento"
            className="input input-bordered outline-1 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Ingrese el numero de documento"
            onChange={handleChange}
          />
          {formData.Numero_Documento === -1 && (
            <span className="text-red-500 text-xs mt-1">El numero de documento es obligatorio</span>
          )}
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
                {detallesOrden.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.Producto}</td>
                    <td>{detalle.Cantidad}</td>
                    <td>{detalle.PrecioXUnidad * detalle.Cantidad}</td>
                    <td>
                      <button
                        className="btn btn-error btn-sm btn-soft"
                        onClick={() => {
                          setDetallesOrden((prevDetalles) =>
                            prevDetalles.filter((_, i) => i !== index)
                          )
                        }}
                      >
                        <X size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr key={-1}>
                  <td></td>
                  <td>
                    <button className="btn btn-success btn-sm btn-soft">
                      <PlusCircle size={20} />
                      <span>Agregar detalle</span>
                    </button>
                  </td>
                  <td></td>
                  <td></td>
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

