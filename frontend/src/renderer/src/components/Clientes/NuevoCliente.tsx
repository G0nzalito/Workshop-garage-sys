import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
import { BadgeCheck, PlusCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'
import MarcaYModeloTabs from '@renderer/specificComponents/MarcaYModeloTabs'
import CreateModeloVehiculo from '@renderer/components/Vehiculos/Modelo/NuevoModelo'

type formDataNuevoCliente = {
  Nombre: string
  Tipo_Documento: number
  Numero_Documento: number
  Direccion: string
  Email: string
  Telefono: number
  Asociacion?: number
}

type Modelo = Database['public']['Tables']['Modelos']['Row']
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

export default function NuevoCliente(): JSX.Element {
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
  const [Modelo, setModelo] = useState()
  const [Cliente, setCliente] = useState()
  const [ModelosLocal, setModelosLocal] = useState<Modelo[]>()
  const [marcaModalKey, setMarcaModalKey] = useState(0)

  const handleChange = (e): void => {
    const { name, value, type } = e.target

    console.log(name, value, type)

    if (type === 'number') {
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

  const handleRadioChange = (event) => {
    console.log(event.target.value)
    setFormData((prevData) => ({
      ...prevData,
      Asociacion: event.target.value === 1 ? true : false
    }))
  }

  const handleSubmit = async (): Promise<void> => {
    console.log(formData)

    // let falta = false

    // for (const key in formData) {
    //   console.log(typeof NaN)
    //   if (
    //     formData[key] === '' ||
    //     formData[key] === 'Falta' ||
    //     formData[key] === 0 ||
    //     formData[key] === -1 ||
    //     Number.isNaN(formData[key])
    //   ) {
    //     falta = true
    //     if (typeof formData[key] === 'string') {
    //       setFormData((prevData) => ({
    //         ...prevData,
    //         [key]: 'Falta'
    //       }))
    //     } else {
    //       setFormData((prevData) => ({
    //         ...prevData,
    //         [key]: -1
    //       }))
    //     }
    //   }
    // }

    // const NuevoVehiculo: VehiculoAInsterar = {
    //   Patente: formData.Patente,
    //   Motor: formData.Motor,
    //   Modelo: formData.Modelo,
    //   Marca: formData.Marca,
    //   Kilometros: formData.Kilometros,
    //   Año: formData.Año
    // }

    // if (!falta) {
    //   console.log('Enviando datos')
    //   const toastEspera = toast.loading('Agregando Vehiculo', {
    //     description: 'Agregando vehiculo a la base de datos'
    //   })

    //   const respuesta = await crearVehiculo(NuevoVehiculo, {
    //     Tipo_Documento: parseInt(formData.Cliente.split('-')[0]),
    //     Numero_Documento: parseInt(formData.Cliente.split('-')[1])
    //   })
    //   toast.dismiss(toastEspera)
    //   if (typeof respuesta === 'string') {
    //     toast.error('Codigo Duplicado', {
    //       description: 'El código del producto ya existe',
    //       duration: 5000,
    //       icon: <X />
    //     })
    //     console.log('Error al crear el vehiculo:', respuesta)
    //   } else {
    //     toast.success('Vehiculo agregado', {
    //       description: `Vehiculo de patente ${formData.Patente} agregado`,
    //       duration: 6000,
    //       icon: <BadgeCheck />
    //     })
    //     limpiarCampos()
    //   }
    // }
  }

  // const limpiarCampos = (): void => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     Codigo: '',
  //     Descripcion: '',
  //     Categoria: 0,
  //     Marca: 0,
  //     SubCategoria: 0,
  //     Proveedor: 0
  //   }))
  //   //@ts-ignore - No se puede asignar un número a un string
  //   setMarca({ value: 0, label: 'Seleccione una Marca' })
  //   //@ts-ignore - No se puede asignar un número a un string
  //   setModelo({ value: 0, label: 'Seleccione un modelo' })
  // }

  // useEffect(() => {
  //   setFormData((prevData) => {
  //     return {
  //       ...prevData,
  //       Modelo: 0
  //     }
  //   })
  //   setModelosLocal(modelos.filter((modelo) => modelo.Marca === formData.Marca))
  // }, [Marca])

  // useEffect(() => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     Marca: 0,
  //     Modelo: 0
  //   }))
  //   //@ts-ignore - No se puede asignar un número a un string
  //   setMarca({ value: 0, label: 'Seleccione una Marca' })
  //   //@ts-ignore - No se puede asignar un número a un string
  //   setModelo({ value: 0, label: 'Seleccione un modelo' })
  // }, [marcaModalKey])

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-lg badge badge-info badge-soft">Agregar nuevo cliente: </h1>
      {/* <span className='loading loading-bars loading-md'></span> */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="grid grid-cols-[180px_1fr_auto] gap-y-4 p-4 max-w-3xl"
      >
        {/* Nombre y Apellido del cliente */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          Nombre y Apellido:
        </span>
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

        {/* Tipo de Documento */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          Tipo de Documento:
        </span>
        <div className="flex flex-col">
          <Select
            name="Tipo_Documento"
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
            onClick={() => document.getElementById('NuevaMarca').showModal()}
          >
            <PlusCircle size={20} />
          </button>
        </div>

        {/* Numero de documento */}
        <span className="fieldset-legend text-right pr-20 self-center font-medium">
          Numero de Documento:
        </span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Numero_Documento"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el numero de documento"
            value={formData.Numero_Documento}
            onChange={handleChange}
          />
          {formData.Numero_Documento === -1 && (
            <span className="text-red-500 text-xs mt-1">El numero de documento es obligatorio</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Teléfono */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Teléfono:</span>
        <div className="flex flex-col">
          <input
            type="number"
            name="Telefono"
            className="input input-bordered outline-1 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Ingrese el teléfono del cliente"
            onChange={handleChange}
            value={formData.Telefono}
          />
        </div>
        <div className="pl-2 self-center"></div>

        {/* Email */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Email:</span>
        <div className="flex flex-col">
          <label className="input input-bordered outline-1 flex items-center w-full">
            <input
              type="email"
              name="Email"
              className="grow [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Ingrese el Email del cliente"
              onChange={handleChange}
              value={formData.Email}
            />
          </label>
        </div>
        <div className="pl-2 self-center"></div>

        <span className="fieldset-legend text-right pr-4 self-center font-medium">Dirección:</span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Direccion"
            className="input input-bordered outline-1 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Ingrese la dirección del cliente"
            onChange={handleChange}
            value={formData.Direccion}
          />
        </div>
        <div className="pl-2 self-center"></div>

        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          ¿Quiere asociarse?
        </span>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            name="Asociacion"
            value={1}
            className="radio radio-success outline-1"
            onChange={handleChange}
          />
          <span> Si </span>
          <input
            type="radio"
            name="Asociacion"
            value={0}
            className="radio radio-error outline-1"
            defaultChecked
            onChange={handleChange}
          />
          <span> No </span>
        </div>
        <div className="pl-2 self-center"></div>

        {/* Botón de envío */}
        <div className="col-span-2 flex justify-end mt-2">
          <button type="submit" className="btn btn-success btn-soft">
            Agregar Cliente
          </button>
        </div>
      </form>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <dialog
        id="NuevaMarca"
        className="modal"
        onClose={(): void => {
          setMarcaModalKey((prev) => prev + 1)
          // formData.Marca = 0
        }}
      >
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="badge badge-soft badge-success">
              <span className="font-bold italic text-3xl">Nueva Marca</span>
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
          <MarcaYModeloTabs
            key={marcaModalKey} // Add key here
            selectedMarca={ModelosLocal !== undefined ? formData.Marca : null}
            defaultTab="marca"
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog id="NuevoModelo" className="modal">
        <div className="modal-box">
          <div className="flex items-center justify-between mb-4">
            <div className="badge badge-soft badge-success">
              <span className="font-bold italic text-3xl">Nuevo Modelo</span>
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
          <CreateModeloVehiculo marca={formData.Marca} />
        </div>
      </dialog>
      <dialog id="NuevoCliente" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Nuevo Cliente</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  )
}

