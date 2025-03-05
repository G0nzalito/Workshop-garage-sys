import { useConsts } from '@renderer/Contexts/constsContext'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { generarCobroSinODT } from '@/src/servicies/cobroService'

import Select from 'react-select'
import { toast } from 'sonner'

const customStyles = {
  container: (provided: any) => ({
    ...provided,
    width: 300
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

export default function CobroSinODT({
  open,
  onClose,
  total
}: {
  open: boolean
  onClose: () => void
  total: number
}): JSX.Element {
  const [formData, setFormData] = useState({
    Cliente: '',

    FormaDePago: 0,

    Total: 0,

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
  const [formaPago, setFormaPaga] = useState()
  const [marketing, setMarketing] = useState()
  const [tarjeta, setTarjeta] = useState()
  const { clientes, formasPago, tarjetas, marketing: marketingOptions } = useConsts()

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData((prevData) => ({
      ...prevData,

      [name]: value
    }))
  }

  const handleSelectChange = (selectedOption, setFunction, formDataName): undefined => {
    setFunction(selectedOption)
    handleChange({ target: { name: formDataName, value: selectedOption.value } })
    if (formDataName === 'FormaDePago') {
      setFormData((prevData) => ({
        ...prevData,
        Total: parseFloat(
          (
            total *
            (1 +
              formasPago.filter((formaPago) => formaPago.id === selectedOption.value)[0].Interes /
                100)
          ).toFixed(2)
        )
      }))
    }
  }

  const handleSubmit = (): undefined => {
    formData.Total = total
    let falta = false
    for (const entry in formData) {
      if (formData.FormaDePago !== 2 && formData.FormaDePago !== 3) {
        console.log('Entre por cash')
        if (
          entry !== 'Cuotas' &&
          entry !== 'N_Cupon' &&
          entry !== 'N_Autorizacion' &&
          entry !== 'N_Lote' &&
          entry !== 'Tarjeta'
        ) {
          if (formData[entry] === '' || formData[entry] === 0 || formData[entry] === 'Falta') {
            falta = true
            setFormData((prevData) => ({
              ...prevData,
              [entry]: 'Falta'
            }))
          }
        }
      } else {
        console.log('Entre por tarjeta')
        if (formData[entry] === '' || formData[entry] === 0 || formData[entry] === 'Falta') {
          falta = true
          setFormData((prevData) => ({
            ...prevData,
            [entry]: 'Falta'
          }))
        }
      }
    }

    if (!falta) {
      // Llamar a la API para cobrar
      generarCobroSinODT()
      console.log()
    }
  }

  return (
    // Este div es mi fondo

    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}
    >
      {/* Este div es mi ventana emergente */}

      <div
        className={`bg-accent-foreground outline-1 rounded-xl shadow p-6 transition-all ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Aca va todo lo que quiero que se muestre en mi ventana emergente */}
        <div className="flex justify-between items-center">
          <h2 className=" text-3xl flex justify-start justify-items-start p-4">
            Venta sin Orden de trabajo
          </h2>
          <button className="btn btn-error" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="h-96 max-h-96 overflow-y-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="scroll"
            id="formCobroSinODT"
          >
            <div className="flex-col items-center m-4 p-1 bg-[#2b2322]">
              <div className="flex justify-center items-center text-2xl">
                <span className="flex justify-center items-center font-bold">Cliente: </span>
                <Select
                  className="rounded-lg m-2 bg-black/90 text-lg"
                  name="Cliente"
                  // options={[
                  //   { value: 'Cliente1', name: 'Cliente 1', label: 'Cliente 1 (45243172 - CUIT)' },

                  //   { value: 'Cliente2', name: 'Cliente 2', label: 'Cliente 2 (24241960 - DNI)' },

                  //   { value: 'Cliente3', name: 'Cliente 3', label: 'Cliente 3 (23108507 - DNI)' }
                  // ]}
                  options={clientes.map((cliente) => ({
                    value: `${cliente.Numero_Documento} - ${cliente.Tipo_Documento}`,
                    name: cliente.Nombre,
                    label: `${cliente.Nombre} (${cliente.Numero_Documento} - ${cliente.Tipo_Documento === 2 ? 'CUIT' : 'DNI'})`
                  }))}
                  onChange={(e) => handleSelectChange(e, setCliente, 'Cliente')}
                  value={cliente}
                  styles={customStyles}
                  placeholder="Seleccione cliente"
                ></Select>
              </div>
              <div className="flex  justify-center">
                {formData.Cliente === 'Falta' && (
                  <span className="text-red-500 text-xs">
                    Por favor, seleccione un cliente en el campo superior
                  </span>
                )}
              </div>
            </div>
            <div className="flex-col items-center m-4 p-1 grid-cols-1 bg-[#2b2322]">
              <div className="flex justify-center items-center text-2xl">
                <span className="font-bold">Forma de pago: </span>
                <Select
                  className="rounded-lg m-2 bg-black/90 text-lg"
                  name="FormaDePago"
                  options={formasPago.map((formaPago) => ({
                    value: formaPago.id,
                    name: formaPago.Nombre,
                    label: `${formaPago.Nombre} (${formaPago.Interes}% interes)`
                  }))}
                  onChange={(e) => handleSelectChange(e, setFormaPaga, 'FormaDePago')}
                  value={formaPago}
                  styles={customStyles}
                  placeholder="Seleccione forma de pago"
                />
              </div>
              <div className="flex justify-center">
                {(formData.FormaDePago === 0 || formData.FormaDePago === 'Falta') && (
                  <p className="text-red-500 text-xs mt-1">
                    Por favor, seleccione una forma de pago en el campo superior
                  </p>
                )}
              </div>
            </div>
            <div className="flex bg-[#2b2322] text-2xl justify-center m-4.5 p-1">
              <p className="text-lg">
                <span className="text-2xl font-bold">Total: </span>{' '}
                {formData.FormaDePago !== 0 && formData.FormaDePago !== 'Falta'
                  ? `${total} + ${formasPago.filter((formaPago) => formaPago.id === formData.FormaDePago)[0].Interes} = 
                  ${(total * (1 + formasPago.filter((formaPago) => formaPago.id === formData.FormaDePago)[0].Interes / 100)).toFixed(2)}`
                  : 'Seleccione primero un metodo de pago'}
              </p>
            </div>
            {(formData.FormaDePago === 2 || formData.FormaDePago === 3) && (
              <>
                <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
                  <div className="flex justify-center items-center text-2xl">
                    <span className="flex justify-star items-center font-bold">Tarjeta: </span>
                    <Select
                      className="rounded-lg m-2 bg-black/90 text-lg"
                      name="FormaDePago"
                      // options={[
                      //   { value: 'Efectivo', name: 'Efectivo', label: 'Efectivo (0% interes)' },
                      //   { value: 'Cheque', name: 'Tarjeta', label: 'Cheque (0% interes)' },
                      //   {
                      //     value: 'TarjetaDebito',
                      //     name: 'Tarjeta',
                      //     label: 'Tarjeta de Debito (5% interes)'
                      //   },
                      //   {
                      //     value: 'TarjetaCredito',
                      //     name: 'Tarjeta',
                      //     label: 'Tarjeta de Credito (8% interes)'
                      //   }
                      // ]}
                      options={tarjetas.map((tarjeta) => ({
                        value: tarjeta.id,
                        name: tarjeta.Nombre,
                        label: `${tarjeta.Nombre}`
                      }))}
                      onChange={(e) => handleSelectChange(e, setTarjeta, 'Tarjeta')}
                      value={tarjeta}
                      styles={customStyles}
                      placeholder="Seleccione la tarjeta"
                    ></Select>
                  </div>
                  <div className="flex justify-center">
                    {formData.Tarjeta === 'Falta' && (
                      <span className="text-red-500 text-xs">
                        Por favor, seleccione una forma de pago en el campo superior
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
                  <div className="flex justify-center items-center text-2xl">
                    <span className="text-2xl font-bold">Cuotas: </span>
                    <input
                      type="number"
                      name="Cuotas"
                      className="input input-bordered appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Cantidad de cuotas"
                      value={formData.Cuotas}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-center">
                    {formData.Cuotas === 'Falta' && (
                      <span className="text-red-500 text-xs">
                        Por favor, ingrese las cuotas en el campo superior
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
                  <div className="flex justify-center items-center text-2xl">
                    <span className="text-2xl font-bold">N° de cupon: </span>
                    <input
                      type="text"
                      name="N_Cupon"
                      className="input input-bordered appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Cupon"
                      value={formData.N_Cupon}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-center">
                    {formData.N_Cupon === 'Falta' && (
                      <span className="text-red-500 text-xs">
                        Por favor, ingrese el cupón de pago en el campo superior
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
                  <div className="flex justify-center items-center text-2xl">
                    <span className="text-2xl font-bold">N° de lote: </span>
                    <input
                      type="text"
                      name="N_Lote"
                      className="input input-bordered appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Lote"
                      value={formData.N_Lote}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-center">
                    {formData.N_Lote === 'Falta' && (
                      <span className="text-red-500 text-xs">
                        Por favor, ingrese el numero de lote en el campo superior
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
                  <div className="flex justify-center items-center text-2xl">
                    <span className="text-2xl font-bold">Autorización: </span>
                    <input
                      type="text"
                      name="N_Autorizacion"
                      className="input input-bordered appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Autorizacion"
                      value={formData.N_Autorizacion}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-center">
                    {formData.N_Autorizacion === 'Falta' && (
                      <span className="text-red-500 text-xs">
                        Por favor, ingrese el numero de autorización en el campo superior
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
            <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
              <div className="flex justify-center items-center text-2xl">
                <span className="flex justify-star items-center font-bold">Marketing: </span>
                <Select
                  className="rounded-lg m-2 bg-black/90 text-lg"
                  name="Marketing"
                  // options={[
                  //   { value: 'Calle', name: 'Calle', label: 'Pase por la calle y los vi' },
                  //   { value: 'Retorno', name: 'Retorno', label: 'Cliente usual' },
                  //   {
                  //     value: 'Recomendacion',
                  //     name: 'Recomendacion',
                  //     label: 'Recomendado por un conocido'
                  //   },
                  //   {
                  //     value: 'Otros',
                  //     name: 'Otros',
                  //     label: 'Otros'
                  //   }
                  // ]}
                  options={marketingOptions.map((marketing) => ({
                    value: marketing.id,
                    name: marketing.Nombre,
                    label: `${marketing.Nombre}`
                  }))}
                  onChange={(e) => handleSelectChange(e, setMarketing, 'Marketing')}
                  value={marketing}
                  styles={customStyles}
                  placeholder="Seleccione medio de reconocimiento del cliente"
                ></Select>
              </div>
              <div className="flex justify-center">
                {formData.Marketing === 'Falta' && (
                  <span className="text-red-500 text-xs">
                    Por favor, ingrese el medio de marketing en el campo superior
                  </span>
                )}
              </div>
            </div>
            <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
              <div className="flex justify-center items-center text-2xl">
                <span className="text-2xl font-bold">Operador 1: </span>
                <input
                  type="text"
                  name="Operador1"
                  className="input input-bordered appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Operador 1"
                  value={formData.Operador1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center">
                {formData.Operador1 === 'Falta' && (
                  <span className="text-red-500 text-xs">
                    Por favor, ingrese el nombre del vendedor en el campo superior
                  </span>
                )}
              </div>
            </div>
            <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
              <div className="flex justify-center items-center text-2xl">
                <span className="text-2xl font-bold">Operador 2: </span>
                <input
                  type="text"
                  name="Operador2"
                  className="input input-bordered appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Operador 2"
                  value={formData.Operador2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center">
                {formData.Operador2 === 'Falta' && (
                  <span className="text-red-500 text-xs">
                    Por favor, ingrese el nombre de el co-vendedor <br />
                    en el campo superior, o ingrese ninguno en caso <br />
                    de que no haya
                  </span>
                )}
              </div>
            </div>
            <div className="flex-col items-center bg-[#2b2322] m-4 p-1">
              <div className="flex justify-center items-center text-2xl">
                <span className="text-2xl font-bold">Supervisor: </span>
                <input
                  type="text"
                  name="Supervisor"
                  className="input input-bordered appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  placeholder="Supervisor"
                  value={formData.Supervisor}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-center">
                {formData.Supervisor === 'Falta' && (
                  <p className="text-red-500 text-xs">
                    Por favor, ingrese el nombre del supervisor a cargo en el campo superior
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end items-end  justify-items-end gap-4 m-5">
          <button
            className="btn btn-soft btn-success"
            onClick={() => {
              document.getElementById('formCobroSinODT').requestSubmit()
            }}
          >
            <span className="font-semibold text-2xl">Cobrar</span>
          </button>
        </div>
      </div>
    </div>
  )
}
