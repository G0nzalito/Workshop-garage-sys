import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
import { BadgeCheck, PlusCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { toast } from 'sonner'
import { crearVehiculo } from '../../../../servicies/vehiculosService'
import CreateMarcaVehiculo from '@renderer/components/Vehiculos/Marcas Vehiculos/CreateMarcaVehiculo'
import MarcaYModeloTabs from '@renderer/specificComponents/MarcaYModeloTabs'
import CreateModeloVehiculo from '@renderer/components/Vehiculos/Modelo/NuevoModelo'

type formDataNuevoVehiculo = {
  Patente: string
  Motor: string
  Modelo: number
  Marca: number
  Kilometros: number
  Año: number
  Cliente: string
}

type VehiculoAInsterar = Database['public']['Tables']['Vehiculo']['Insert']
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

export default function NuevoVehiculo(): JSX.Element {
  const [formData, setFormData] = useState<formDataNuevoVehiculo>({
    Patente: '',
    Motor: '',
    Marca: 0,
    Modelo: 0,
    Kilometros: 0,
    Año: 0,
    Cliente: ''
  })

  const { marcasVehiculos, modelos, clientes } = useConsts()
  const [Marca, setMarca] = useState()
  const [Modelo, setModelo] = useState()
  const [Cliente, setCliente] = useState()
  const [ModelosLocal, setModelosLocal] = useState<Modelo[]>()
  const [marcaModalKey, setMarcaModalKey] = useState(0)

  const handleChange = (e): void => {
    const { name, value, type } = e.target
    if (name === 'Patente') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.toUpperCase()
      }))
    } else {
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
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName): void => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
  }

  const handleSubmit = async (): Promise<void> => {
    let falta = false

    for (const key in formData) {
      console.log(typeof NaN)
      if (
        formData[key] === '' ||
        formData[key] === 'Falta' ||
        formData[key] === 0 ||
        formData[key] === -1 ||
        Number.isNaN(formData[key])
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

    const NuevoVehiculo: VehiculoAInsterar = {
      Patente: formData.Patente,
      Motor: formData.Motor,
      Modelo: formData.Modelo,
      Marca: formData.Marca,
      Kilometros: formData.Kilometros,
      Año: formData.Año
    }

    if (!falta) {
      console.log('Enviando datos')
      const toastEspera = toast.loading('Agregando Vehiculo', {
        description: 'Agregando vehiculo a la base de datos'
      })

      const respuesta = await crearVehiculo(NuevoVehiculo, {
        Tipo_Documento: parseInt(formData.Cliente.split('-')[0]),
        Numero_Documento: parseInt(formData.Cliente.split('-')[1])
      })
      toast.dismiss(toastEspera)
      if (typeof respuesta === 'string') {
        toast.error('Codigo Duplicado', {
          description: 'El código del producto ya existe',
          duration: 5000,
          icon: <X />
        })
        console.log('Error al crear el vehiculo:', respuesta)
      } else {
        toast.success('Vehiculo agregado', {
          description: `Vehiculo de patente ${formData.Patente} agregado`,
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
      Codigo: '',
      Descripcion: '',
      Categoria: 0,
      Marca: 0,
      SubCategoria: 0,
      Proveedor: 0
    }))
    //@ts-ignore - No se puede asignar un número a un string
    setMarca({ value: 0, label: 'Seleccione una Marca' })
    //@ts-ignore - No se puede asignar un número a un string
    setModelo({ value: 0, label: 'Seleccione un modelo' })
  }

  useEffect(() => {
    setFormData((prevData) => {
      return {
        ...prevData,
        Modelo: 0
      }
    })
    setModelosLocal(modelos.filter((modelo) => modelo.Marca === formData.Marca))
  }, [Marca])

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      Marca: 0,
      Modelo: 0
    }))
    //@ts-ignore - No se puede asignar un número a un string
    setMarca({ value: 0, label: 'Seleccione una Marca' })
    //@ts-ignore - No se puede asignar un número a un string
    setModelo({ value: 0, label: 'Seleccione un modelo' })
  }, [marcaModalKey])

  return (
    <div className="flex flex-col p-4">
      <h1 className="text-lg badge badge-info badge-soft">Agregar nuevo Vehículo: </h1>
      {/* <span className='loading loading-bars loading-md'></span> */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="grid grid-cols-[180px_1fr_auto] gap-y-4 p-4 max-w-3xl"
      >
        {/* Patente del vehiculo */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Patente:</span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Patente"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el patente del nuevo producto"
            value={formData.Patente}
            onChange={handleChange}
          />
          {formData.Patente === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">La patente es obligatoria</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Motor del vehiculo */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Motor:</span>
        <div className="flex flex-col">
          <input
            type="text"
            name="Motor"
            className="input input-bordered outline-1 w-full"
            placeholder="Ingrese el motor del vehiculo"
            value={formData.Motor}
            onChange={handleChange}
          />
          {formData.Motor === 'Falta' && (
            <span className="text-red-500 text-xs mt-1">El motor es obligatorio</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Marca del vehiculo */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Marca:</span>
        <div className="flex flex-col">
          <Select
            name="Marca"
            options={marcasVehiculos
              .filter((marca) => marca.Dada_de_baja === false)
              .map((Marca) => {
                return {
                  value: Marca.id,
                  label: Marca.Nombre
                }
              })}
            onChange={(e) => handleSelectChange(e, setMarca, 'Marca')}
            value={Marca}
            styles={customStyles}
            placeholder="Seleccione una Marca"
            className="w-full"
          />
          {formData.Marca === -1 && (
            <span className="text-red-500 text-xs mt-1">Debe seleccionar una Marca</span>
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

        {/* Modelo (condicional) */}
        {ModelosLocal !== undefined && ModelosLocal?.length > 0 && (
          <>
            <span className="fieldset-legend text-right pr-4 self-center font-medium">Modelo:</span>
            <div className="flex flex-col">
              <Select
                name="SubCategoria"
                options={ModelosLocal.map((Modelo) => {
                  return {
                    value: Modelo.id,
                    label: Modelo.Nombre
                  }
                })}
                onChange={(e) => handleSelectChange(e, setModelo, 'Modelo')}
                value={Modelo}
                styles={customStyles}
                placeholder="Seleccione un modelo"
                className="w-full"
              />
              {formData.Modelo === -1 && (
                <span className="text-red-500 text-xs mt-1">Debe seleccionar un modelo</span>
              )}
            </div>
            <div className="pl-2 self-center">
              <button
                className="btn btn-sm btn-success btn-soft"
                type="button"
                //@ts-ignore el objeto es un modal que dentro de la propia pagina me incitan a usarlo así
                onClick={() => document.getElementById('NuevoModelo').showModal()}
              >
                <PlusCircle size={20} />
              </button>
            </div>
          </>
        )}

        {/* Dueño del vehiculo */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Dueño:</span>
        <div className="flex flex-col">
          <Select
            name="Cliente"
            options={clientes
              .filter((cliente) => cliente.id !== 0)
              .map((Cliente) => {
                return {
                  value: `${Cliente.Tipo_Documento}-${Cliente.Numero_Documento}`,
                  label: `${Cliente.Nombre} (${Cliente.Tipo_Documento === 1 ? 'DNI' : 'CUIT'} - ${Cliente.Numero_Documento})`
                }
              })}
            onChange={(e) => handleSelectChange(e, setCliente, 'Cliente')}
            value={Cliente}
            styles={customStyles}
            placeholder="Seleccione el dueño del vehículo"
            className="w-full"
          />
          {formData.Cliente === '' && (
            <span className="text-red-500 text-xs mt-1">
              Debe seleccionar un dueño para el vehículo
            </span>
          )}
        </div>
        <div className="pl-2 self-center">
          <button
            type="button"
            className="btn btn-sm btn-success btn-soft"
            //@ts-ignore el objeto es un modal que dentro de la propia pagina me incitan a usarlo así
            onClick={() => document.getElementById('NuevoCliente').showModal()}
          >
            <PlusCircle size={20} />
          </button>
        </div>

        {/* Kilometros */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">
          Kilometros 1° vez:
        </span>
        <div className="flex flex-col">
          <input
            type="number"
            name="Kilometros"
            className="input input-bordered outline-1 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="Ingrese los kilometros actuales del vehículo"
            onChange={handleChange}
            value={formData.Kilometros}
          />
          {formData.Kilometros === -1 && (
            <span className="text-red-500 text-xs mt-1">Los kilometros son obligatorios</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Año */}
        <span className="fieldset-legend text-right pr-4 self-center font-medium">Año:</span>
        <div className="flex flex-col">
          <label className="input input-bordered outline-1 flex items-center w-full">
            <input
              type="number"
              name="Año"
              className="grow [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Ingrese el Año del vehículo"
              onChange={handleChange}
              value={formData.Año}
            />
          </label>
          {formData.Año === -1 && (
            <span className="text-red-500 text-xs mt-1">El año es obligatorio</span>
          )}
        </div>
        <div className="pl-2 self-center"></div>

        {/* Botón de envío */}
        <div className="col-span-2 flex justify-end mt-2">
          <button type="submit" className="btn btn-success btn-soft">
            Agregar Vehiculo
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

