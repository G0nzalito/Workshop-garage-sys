import { useConsts } from '@renderer/Contexts/constsContext'
import { BadgeCheck, X } from 'lucide-react'
import React, { useState } from 'react'
import { generarCobroSinODT } from '../../../../servicies/cobroService.js'
import { modificarStockProducto } from '../../../../servicies/productosService.js'

import { Database } from '@/src/types/database.types.js'
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

type Producto = Database['public']['Tables']['Productos']['Row']

export default function CobroSinODT({
  open,
  onClose,
  total,
  productos,
  setProductos
}: {
  open: boolean
  onClose: () => void
  total: number
  productos: { Producto: Producto; cantidad: number; stockMaximo: number }[]
  setProductos: React.Dispatch<
    React.SetStateAction<{ Producto: Producto; cantidad: number; stockMaximo: number }[]>
  >
}): JSX.Element | null {
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

    Supervisor: '',

    Descripcion: '',

    Tipo_de_comprobante: 0
  })

  const [cliente, setCliente] = useState()
  const [formaPago, setFormaPaga] = useState()
  const [marketing, setMarketing] = useState()
  const [comprobante, setComprobante] = useState()
  const [tarjeta, setTarjeta] = useState()
  const {
    clientes,
    formasPago,
    tarjetas,
    marketing: marketingOptions,
    comprobantes,
    sucursalSeleccionada
  } = useConsts()

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
    // if (formDataName === 'FormaDePago') {
    //   setFormData((prevData) => ({
    //     ...prevData,
    //     Total: parseFloat(
    //       (
    //         total *
    //         (1 +
    //           formasPago.filter((formaPago) => formaPago.id === selectedOption.value)[0].Interes /
    //             100)
    //       ).toFixed(2)
    //     )
    //   }))
    // }
  }

  const handleSubmit = async (): Promise<undefined> => {
    formData.Total = total
    let falta = false
    for (const entry in formData) {
      if (entry === 'Descripcion') continue

      if (formData.FormaDePago !== 2 && formData.FormaDePago !== 3) {
        // console.log('Entre por cash')
        if (
          entry !== 'Cuotas' &&
          entry !== 'N_Cupon' &&
          entry !== 'N_Autorizacion' &&
          entry !== 'N_Lote' &&
          entry !== 'Tarjeta'
        ) {
          if (formData[entry] === '' || formData[entry] === 0 || formData[entry] === 'Falta') {
            falta = true
            if (typeof formData[entry] === 'string') {
              setFormData((prevData) => ({
                ...prevData,
                [entry]: 'Falta'
              }))
            } else {
              setFormData((prevData) => ({
                ...prevData,
                [entry]: 0
              }))
            }
            // setFormData((prevData) => ({
            //   ...prevData,
            //   [entry]: 'Falta'
            // }))
          }
        }
      } else {
        // console.log('Entre por tarjeta')
        if (formData[entry] === '' || formData[entry] === 0 || formData[entry] === 'Falta') {
          falta = true
          if (typeof formData[entry] === 'string') {
            setFormData((prevData) => ({
              ...prevData,
              [entry]: 'Falta'
            }))
          } else {
            setFormData((prevData) => ({
              ...prevData,
              [entry]: 0
            }))
          }
          // setFormData((prevData) => ({
          //   ...prevData,
          //   [entry]: 'Falta'
          // }))
        }
      }
    }

    if (!falta) {
      const toastCargando = toast.loading('Generando Cobro', {
        description: 'Espere un momento por favor'
      })
      const response = await generarCobroSinODT({
        Forma_de_Pago: formData.FormaDePago,
        Tarjeta: formData.Tarjeta,
        Cuotas: formData.Cuotas,
        Fuente_MKT: formData.Marketing,
        Numero_Documento_Cliente: parseInt(formData.Cliente.split(' - ')[0]),
        Tipo_Documento_Cliente: parseInt(formData.Cliente.split(' - ')[1]),
        Sub_Total: total,
        Turno: 1,
        N_Autorizacion: formData.N_Autorizacion,
        N_Cupon: formData.N_Cupon,
        N_Lote: formData.N_Lote,
        Operador_1: formData.Operador1,
        Operador_2: formData.Operador2,
        Supervisor: formData.Supervisor,
        Descripcion: formData.Descripcion,
        Sucursal_id: sucursalSeleccionada,
        Tipo_de_comprobante: formData.Tipo_de_comprobante
      })

      toast.dismiss(toastCargando)
      if (response === 201) {
        toast.success('Venta Realizada', {
          description: `Venta por el valor de $${total} realizada con exito`,
          duration: 6000,
          icon: <BadgeCheck />
        })
        await modificarStockProducto(productos, sucursalSeleccionada, false)
        console.log('Stock modificado')
        setProductos([])
        onClose()
      }
    } else {
      toast.error('Error al realizar la venta', {
        description: 'Por favor complete todos los campos',
        duration: 3000,
        icon: <X />
      })
    }
  }

  if (!open) return null

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
            className="grid grid-cols-[180px_1fr] gap-y-4 p-4 max-w-2xl mx-auto"
            id="formCobroSinODT"
          >
            {/* Cliente */}
            <span className="text-right pr-4 self-center font-bold">Cliente:</span>
            <div className="flex flex-col">
              <Select
                className="rounded-lg bg-black/90 text-lg w-full"
                name="Cliente"
                options={clientes.map((cliente) => ({
                  value: `${cliente.Numero_Documento} - ${cliente.Tipo_Documento}`,
                  name: cliente.Nombre,
                  label: `${cliente.Nombre} ${cliente.Numero_Documento === -1 ? ` ` : `(${cliente.Numero_Documento} - ${cliente.Tipo_Documento === 2 ? 'CUIT' : 'DNI'})`}`
                }))}
                onChange={(e) => handleSelectChange(e, setCliente, 'Cliente')}
                value={cliente}
                styles={customStyles}
                placeholder="Seleccione cliente"
              />
              {formData.Cliente === 'Falta' && (
                <span className="text-red-500 text-xs mt-1">
                  Por favor, seleccione un cliente en el campo superior
                </span>
              )}
            </div>

            {/* Forma de pago */}
            <span className="text-right pr-4 self-center font-bold">Forma de pago:</span>
            <div className="flex flex-col">
              <Select
                className="rounded-lg bg-black/90 text-lg w-full"
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
              {formData.FormaDePago === 0 && (
                <p className="text-red-500 text-xs mt-1">
                  Por favor, seleccione una forma de pago en el campo superior
                </p>
              )}
            </div>

            {/* Total */}
            <span className="text-right pr-4 self-center font-bold">Total:</span>
            <p className="text-lg self-center">
              {formData.FormaDePago !== 0
                ? `${total} + ${formasPago.filter((formaPago) => formaPago.id === formData.FormaDePago)[0].Interes} = 
      ${(total * (1 + formasPago.filter((formaPago) => formaPago.id === formData.FormaDePago)[0].Interes / 100)).toFixed(2)}`
                : 'Seleccione primero un metodo de pago'}
            </p>

            {/* Sección condicional para tarjetas */}
            {(formData.FormaDePago === 2 || formData.FormaDePago === 3) && (
              <>
                {/* Tarjeta */}
                <span className="text-right pr-4 self-center font-bold">Tarjeta:</span>
                <div className="flex flex-col">
                  <Select
                    className="rounded-lg bg-black/90 text-lg w-full"
                    name="FormaDePago"
                    options={tarjetas.map((tarjeta) => ({
                      value: tarjeta.id,
                      name: tarjeta.Nombre,
                      label: `${tarjeta.Nombre}`
                    }))}
                    onChange={(e) => handleSelectChange(e, setTarjeta, 'Tarjeta')}
                    value={tarjeta}
                    styles={customStyles}
                    placeholder="Seleccione la tarjeta"
                  />
                  {formData.Tarjeta === 'Falta' && (
                    <span className="text-red-500 text-xs mt-1">
                      Por favor, seleccione una forma de pago en el campo superior
                    </span>
                  )}
                </div>

                {/* Cuotas */}
                <span className="text-right pr-4 self-center font-bold">Cuotas:</span>
                <div className="flex flex-col">
                  <input
                    type="number"
                    name="Cuotas"
                    className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Cantidad de cuotas"
                    value={formData.Cuotas}
                    onChange={handleChange}
                  />
                  {formData.Cuotas === 'Falta' && (
                    <span className="text-red-500 text-xs mt-1">
                      Por favor, ingrese las cuotas en el campo superior
                    </span>
                  )}
                </div>

                {/* N° de cupón */}
                <span className="text-right pr-4 self-center font-bold">N° de cupón:</span>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="N_Cupon"
                    className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Cupón"
                    value={formData.N_Cupon}
                    onChange={handleChange}
                  />
                  {formData.N_Cupon === 'Falta' && (
                    <span className="text-red-500 text-xs mt-1">
                      Por favor, ingrese el cupón de pago en el campo superior
                    </span>
                  )}
                </div>

                {/* N° de lote */}
                <span className="text-right pr-4 self-center font-bold">N° de lote:</span>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="N_Lote"
                    className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Lote"
                    value={formData.N_Lote}
                    onChange={handleChange}
                  />
                  {formData.N_Lote === 'Falta' && (
                    <span className="text-red-500 text-xs mt-1">
                      Por favor, ingrese el numero de lote en el campo superior
                    </span>
                  )}
                </div>

                {/* Autorización */}
                <span className="text-right pr-4 self-center font-bold">Autorización:</span>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="N_Autorizacion"
                    className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    placeholder="Autorización"
                    value={formData.N_Autorizacion}
                    onChange={handleChange}
                  />
                  {formData.N_Autorizacion === 'Falta' && (
                    <span className="text-red-500 text-xs mt-1">
                      Por favor, ingrese el numero de autorización en el campo superior
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Marketing */}
            <span className="text-right pr-4 self-center font-bold">Marketing:</span>
            <div className="flex flex-col">
              <Select
                className="rounded-lg bg-black/90 text-lg w-full"
                name="Marketing"
                options={marketingOptions.map((marketing) => ({
                  value: marketing.id,
                  name: marketing.Nombre,
                  label: `${marketing.Nombre}`
                }))}
                onChange={(e) => handleSelectChange(e, setMarketing, 'Marketing')}
                value={marketing}
                styles={customStyles}
                placeholder="Seleccione medio de reconocimiento del cliente"
              />
              {formData.Marketing === 'Falta' && (
                <span className="text-red-500 text-xs mt-1">
                  Por favor, ingrese el medio de marketing en el campo superior
                </span>
              )}
            </div>
            <span className="text-right pr-4 self-center font-bold">Comprobante:</span>
            <div className="flex flex-col">
              <Select
                className="rounded-lg bg-black/90 text-lg w-full"
                name="Marketing"
                options={comprobantes.map((comprobante) => ({
                  value: comprobante.id,
                  name: comprobante.Nombre,
                  label: `${comprobante.Nombre}`
                }))}
                onChange={(e) => handleSelectChange(e, setComprobante, 'Tipo_de_comprobante')}
                value={comprobante}
                styles={customStyles}
                placeholder="¿Se entrega factura?"
              />
              {formData.Tipo_de_comprobante === 0 && (
                <span className="text-red-500 text-xs mt-1">
                  Por favor, ingrese el concepto de factura en el campo superior
                </span>
              )}
            </div>

            {/* Operador 1 */}
            <span className="text-right pr-4 self-center font-bold">Operador 1:</span>
            <div className="flex flex-col">
              <input
                type="text"
                name="Operador1"
                className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Operador 1"
                value={formData.Operador1}
                onChange={handleChange}
              />
              {formData.Operador1 === 'Falta' && (
                <span className="text-red-500 text-xs mt-1">
                  Por favor, ingrese el nombre del vendedor en el campo superior
                </span>
              )}
            </div>

            {/* Operador 2 */}
            <span className="text-right pr-4 self-center font-bold">Operador 2:</span>
            <div className="flex flex-col">
              <input
                type="text"
                name="Operador2"
                className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Operador 2"
                value={formData.Operador2}
                onChange={handleChange}
              />
              {formData.Operador2 === 'Falta' && (
                <span className="text-red-500 text-xs mt-1">
                  Por favor, ingrese el nombre de el co-vendedor o ingrese ninguno en caso de que no
                  haya
                </span>
              )}
            </div>

            {/* Supervisor */}
            <span className="text-right pr-4 self-center font-bold">Supervisor:</span>
            <div className="flex flex-col">
              <input
                type="text"
                name="Supervisor"
                className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                placeholder="Supervisor"
                value={formData.Supervisor}
                onChange={handleChange}
              />
              {formData.Supervisor === 'Falta' && (
                <p className="text-red-500 text-xs mt-1">
                  Por favor, ingrese el nombre del supervisor a cargo en el campo superior
                </p>
              )}
            </div>

            {/* Comentarios */}
            <span className="text-right pr-4 self-center font-bold">Comentarios:</span>
            <input
              type="text"
              name="Descripcion"
              className="input input-bordered appearance-none w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="Descripción"
              value={formData.Descripcion}
              onChange={handleChange}
            />
          </form>
        </div>
        <div className="flex justify-end items-end  justify-items-end gap-4 m-5">
          <button
            className="btn btn-soft btn-success"
            onClick={() => {
              //@ts-ignore no te va a ser nulo
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
