import { getVehiculosFiltrados } from '../../../../servicies/vehiculosService'
import {
  getProductoByCodigo,
  hayStockParaVenta,
  obtenerStockProductos
} from '../../../../servicies/productosService'
import { Database } from '@/src/types/database.types'
import { useState } from 'react'
import { useConsts } from '@renderer/Contexts/constsContext'
import { PlusCircle, X } from 'lucide-react'
import { toast } from 'sonner'

type formDataNuevaODT = {
  Cliente: string
  Patente: string
  Razon: string
}

type Vehiculo = Database['public']['Tables']['Vehiculo']['Row']
type VehiculoAMostrar = Omit<Vehiculo, 'Cliente'> & { Cliente: string }
type Producto = Database['public']['Tables']['Productos']['Row']
type DetallesOrdenAInsertar = Database['public']['Tables']['Consumos Stock']['Insert']

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

export default function AgregarDetallesODT({
  cesta,
  setCesta
}: {
  cesta: { Producto: Producto; cantidad: number; stockMaximo: number }[]
  setCesta: React.Dispatch<
    React.SetStateAction<{ Producto: Producto; cantidad: number; stockMaximo: number }[]>
  >
}): JSX.Element {
  const [formDataDetail, setFormDataDetail] = useState({
    Codigo: '',
    Cantidad: ''
  })

  const { sucursalSeleccionada } = useConsts()

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

  return (
    <div>
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
  )
}

