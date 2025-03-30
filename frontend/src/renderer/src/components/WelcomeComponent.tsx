import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { X, CirclePlus } from 'lucide-react'
import {
  getProductoByCodigo,
  hayStockParaVenta,
  obtenerStockProductos
} from '../../../servicies/productosService'
import { Database } from '../../../types/database.types'
import CobroSinODT from '@renderer/components/Cobro/CobroSinODT'
import { toast } from 'sonner'
import { useConsts } from '@renderer/Contexts/constsContext'
import { getClientes } from '../../../servicies/clientesService'
import {
  getFormasPago,
  getTarjetas,
  getMarketing,
  getComprobantes
} from '../../../servicies/formaPagoService'
import SeleccionSucursal from '@renderer/components/Administrativo/SeleccionSucursal'
import { getSucursales } from '../../../servicies/sucursalesService'
import PopUp from '@renderer/specificComponents/PopUp'
import PopUpNoX from '@renderer/specificComponents/PopUpNoX'

type Producto = Database['public']['Tables']['Productos']['Row']

export default function WelcomeComponent(): JSX.Element {
  const [, setLocation] = useLocation()
  const [cesta, setCesta] = useState<
    { Producto: Producto; cantidad: number; stockMaximo: number }[]
  >([])
  const [formData, setFormData] = useState({
    Codigo: '',
    Cantidad: ''
  })
  const [total, setTotal] = useState(0)
  const [cobrando, setCobrando] = useState(false)

  const {
    setClientes,
    setFormasPago,
    setTarjetas,
    setMarketing,
    setComprobantes,
    sucursalSeleccionada,
    setSucursales
  } = useConsts()

  const [seleccionSucursal, setSeleccionSucursal] = useState(false)

  const handleChange = (e): void => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase()
    }))
  }

  const getProductos = async (data): Promise<void> => {
    const toastLoading = toast.loading('Cargando producto')
    try {
      const itemExistente = cesta.find((item) => item.Producto.Codigo === data.Codigo)

      if (itemExistente) {
        console.log(itemExistente)

        if (
          parseFloat(itemExistente.cantidad) + parseFloat(data.Cantidad) >
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
                cantidad: parseFloat(item.cantidad) + parseFloat(data.Cantidad)
              }
            }
            return item
          })
        )
        toast.success('Producto agregado con exito', {
          description: 'Figura en la tabla',
          duration: 3000
        })
        return
      }

      const producto: Producto = await getProductoByCodigo(data.Codigo, sucursalSeleccionada)

      if (producto) {
        try {
          const hayStock = await hayStockParaVenta(producto.Codigo, data.Cantidad, sucursalSeleccionada)
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

  const handleSubmit = (data): void => {
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
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    let precioTotal = 0
    cesta.forEach((producto) => {
      precioTotal += producto.Producto.Precio * producto.cantidad
    })
    setTotal(precioTotal)
  }, [cesta])

  useEffect(() => {
    getClientes().then((clientes) => {
      setClientes(clientes)
    })
    getFormasPago().then((formasPago) => {
      formasPago.sort((a, b) => a.id - b.id)
      setFormasPago(formasPago)
    })
    getTarjetas().then((tarjetas) => {
      setTarjetas(tarjetas)
    })
    getMarketing().then((marketing) => {
      setMarketing(marketing)
    })
    getComprobantes().then((comprobantes) => {
      setComprobantes(comprobantes)
    })

    getSucursales().then((sucursales) => {
      setSucursales(sucursales)
      if (!sucursalSeleccionada) {
        setSeleccionSucursal(true)
      }
    })
  }, [])

  // console.log(sucursalSeleccionada)

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
              {cesta.map((producto, index) => {
                return (
                  <tr key={index}>
                    <td>{producto.Producto.Codigo}</td>
                    <td>{producto.Producto.Descripcion}</td>
                    <td>{producto.cantidad}</td>
                    <td>${producto.Producto.Precio * producto.cantidad}</td>
                    <td>
                      <button
                        className="btn btn-error"
                        onClick={() => {
                          setCesta(cesta.filter((producto, index2) => index2 !== index))
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
                      className="input input-bordered w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
              setCesta([])
            }}
          >
            Cancelar venta
          </button>
        <PopUpNoX
          Component={SeleccionSucursal}
          open={seleccionSucursal}
          onClose={() => setSeleccionSucursal(false)}
          mainTitle="Seleccion de sucursal"
        ></PopUpNoX>
        <CobroSinODT
          open={cobrando}
          onClose={() => setCobrando(false)}
          total={total}
          productos={cesta}
          setProductos={setCesta}
        ></CobroSinODT>
        </div>
      </div>
    </>
  )
}
