import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { X, CirclePlus } from 'lucide-react'
import { getProductoByCodigo, hayStockParaVenta } from '../../../servicies/productosService'
import { Database } from '../../../types/database.types'
import CobroSinODT from '@renderer/components/Cobro/CobroSinODT.js'
import { toast } from 'sonner'
import { useConsts } from '@renderer/Contexts/clienteContext'
import { getClientes } from '../../../servicies/clientesService'
import { getFormasPago } from '../../../servicies/formaPagoService'

type Producto = Database['public']['Tables']['Productos']['Row']

export default function WelcomeComponent(): JSX.Element {
  const [, setLocation] = useLocation()
  const [productos, setProductos] = useState<{ Producto: Producto; cantidad: number }[]>([])
  const [formData, setFormData] = useState({
    Codigo: '',
    Cantidad: ''
  })
  const [total, setTotal] = useState(0)
  const [cobrando, setCobrando] = useState(false)

  const { setClientes, setFormasPago } = useConsts()

  const handleChange = (e): void => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase()
    }))
  }

  const getProductos = async (data): Promise<void> => {
    try {
      const producto: Producto = await getProductoByCodigo(data.Codigo)

      if (producto) {
        try {
          const hayStock = await hayStockParaVenta(producto.Codigo, data.Cantidad)
          if (hayStock) {
            if (productos.length > 0) {
              setProductos([...productos, { Producto: producto, cantidad: data.Cantidad }])
            } else {
              setProductos([{ Producto: producto, cantidad: data.Cantidad }])
            }
            toast.success('Producto agregado con exito', {
              description: 'Figura en la tabla',
              duration: 3000
            })
          }
        } catch (noProductos) {
          console.error(noProductos)
          toast.error('No hay stock suficiente', {
            description: 'No se puede agregar el producto',
            duration: 3000
          })
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Producto no encontrado', {
        description: 'No se puede agregar el producto',
        duration: 3000
      })
    }
  }

  const handleSubmit = (data): void => {
    try {
      //@ts-ignore no va a ser nulo, no seas bobo
      getProductos(data).then(() => {
        console.log('Producto agregado')
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    let precioTotal = 0
    productos.forEach((producto) => {
      precioTotal += producto.Producto.Precio * producto.cantidad
    })
    setTotal(precioTotal)
  }, [productos])

  useEffect(() => {
    getClientes().then((clientes) => {
      setClientes(clientes)
    })
    getFormasPago().then((formasPago) => {
      formasPago.sort((a, b) => a.id - b.id)
      setFormasPago(formasPago)
    })
  }, [])

  return (
    <>
      <div className="p-24 bg-base-100 text-white">
        <div className="overflow-x-auto rounded-box border border-base-content/5">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Codigo</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => {
                return (
                  <tr key={index}>
                    <td>{producto.Producto.Codigo}</td>
                    <td>{producto.Producto.Descripcion}</td>
                    <td>{producto.cantidad}</td>
                    <td>{producto.Producto.Precio * producto.cantidad}</td>
                    <td>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          setProductos(productos.filter((producto, index2) => index2 !== index))
                        }}
                      >
                        <X />
                      </button>
                    </td>
                  </tr>
                )
              })}
              <tr>
                <td>
                  <form
                    id="formVenta"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit(formData)
                    }}
                  >
                    <input
                      type="text"
                      name="Codigo"
                      className="input input-bordered"
                      placeholder="Codigo de producto"
                      value={formData.Codigo}
                      onChange={handleChange}
                    />
                  </form>
                </td>
                <td></td>
                <td>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit(formData)
                    }}
                  >
                    <input
                      type="number"
                      name="Cantidad"
                      className="input input-bordered [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      placeholder="Cantidad"
                      value={formData.Cantidad}
                      onChange={handleChange}
                    />
                  </form>
                </td>
                <td></td>
                <td></td>
                <td>
                  <button className="btn btn-soft btn-success" form="formVenta">
                    <CirclePlus />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-right mt-2 pr-6 font-bold text-lg">
          <div className="badge badge-soft badge-success badge-xl m-5">SubTotal $: {total} </div>
        </div>
        <div className="flex justify-start m-2.5 gap-4">
          <button
            className="btn btn-soft btn-success"
            onClick={() => {
              setCobrando(true)
            }}
          >
            Cobrar
          </button>
          <button
            className="btn btn-soft btn-error"
            onClick={() => {
              setProductos([])
            }}
          >
            Cancelar venta
          </button>
        </div>
        <CobroSinODT open={cobrando} onClose={() => setCobrando(false)} total={total}></CobroSinODT>
      </div>
    </>
  )
}
