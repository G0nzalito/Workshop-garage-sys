import { Database } from '@/src/types/database.types'
import { useConsts } from '@renderer/Contexts/constsContext'
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

export default function BusquedaVehiculo(): JSX.Element {
  const [formdata, setFormData] = useState({
    patente: '',
    marca: 0,
    modelo: 0,
    año: 0,
    kilometros: 0,
    motor: ''
  })

  const { marcasVehiculos, modelos } = useConsts()

  const [marca, setMarca] = useState(null)
  const [modelo, setModelo] = useState(null)
  const [modelosLocal, setModelosLocal] = useState<Modelo[]>([])

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
    console.log('filtrado')
  }

  useEffect(() => {
    setModelosLocal(modelos.filter((modelo) => modelo.Marca === formdata.marca))
  }, [marca])

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <h2 className="">
          <span className="badge badge-soft badge-info text-lg italic">
            Criterios de busqueda:{' '}
          </span>
        </h2>
        <div className="flex gap-2">
          <form onSubmit={handleFilter} className="flex flex-wrap gap-3" id="formBusquedaProductos">
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
            <fieldset>
              <legend className="fieldset-legend"> Año:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa el año del vehiculo..."
                name="año"
                onChange={handleChange}
                value={formdata.año}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Kilometros:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa los kilometros vehiculo..."
                name="kilometros"
                onChange={handleChange}
                value={formdata.kilometros}
              />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Motor:</legend>
              <input
                type="text"
                className="input input-md outline-1 w-60"
                placeholder="Ingresa el motor  del vehiculo..."
                name="Motor"
                onChange={handleChange}
                value={formdata.motor}
              />
            </fieldset>
          </form>
        </div>
      </div>
    </>
  )
}

