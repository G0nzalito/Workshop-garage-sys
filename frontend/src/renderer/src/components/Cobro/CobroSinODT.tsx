import { useState, useEffect } from 'react'
import Select from 'react-select'

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'black',
    borderColor: 'gray',
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
  })
}

export default function CobroSinODT({ open, onClose, total }) {
  const [formData, setFormData] = useState({
    Cliente: '',
    FormaDePago: '',
    Total: '',
    Tarjeta: '',
    Cuotas: '',
    N_Cupon: '',
    N_Autorizacion: '',
    N_Lote: '',
    Marketing: '',
    Operador1: '',
    Operador2: '',
    Supervisor: ''
  })

  const [cliente, setCliente] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName) => {
    setFunction(selectedOption.label)
    handleChange({ name: formDataName, value: selectedOption.value })
  }

  console.log(cliente)

  return (
    // Este div es mi fondo
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}
    >
      {/* Este div es mi ventana emergente */}
      <div
        className={`bg-blue-950 rounded-xl shadow p-6 transition-all ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Aca va todo lo que quiero que se muestre en mi ventana emergente */}

        <div>
          <h2 className=" text-3xl flex justify-start justify-items-start p-4">
            Venta sin Orden de trabajo
          </h2>
          <form>
            <div className="flex bg-blue-500 text-2xl justify-center m-4.5 p-1">
              <span className="flex">
                Cliente:{' '}
                <Select
                  className="rounded-lg m-2 bg-black/90 text-lg"
                  options={[
                    { value: 'Cliente1', label: 'Cliente 1' },
                    { value: 'Cliente2', label: 'Cliente 2' },
                    { value: 'Cliente3', label: 'Cliente 3' }
                  ]}
                  onChange={(e) => handleSelectChange(e, setCliente, 'Cliente')}
                  value={cliente}
                  styles={customStyles}
                ></Select>
              </span>
            </div>
            <div className="flex bg-blue-500 text-2xl justify-center m-4.5 p-1">
              <span>
                Forma de pago:{' '}
                <select name="FormaDePago" className="rounded-lg m-2 bg-black text-lg">
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </span>
            </div>
            <div className="flex bg-blue-500 text-2xl justify-center m-4.5 p-1">
              <p className="text-lg">
                <span className="text-2xl font-bold">Total: </span> {total} + interes si aplicara
              </p>
            </div>
            {}
          </form>
        </div>
      </div>
    </div>
  )
}

