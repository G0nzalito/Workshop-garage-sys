import { useState, useEffect } from 'react'
import { useLocation } from 'wouter'
import { X, CirclePlus, Drama, Key } from 'lucide-react'
import { getProductoByCodigo, hayStockParaVenta } from '../../../servicies/productosService.js'
import { Database } from '../../../types/database.types'

type Producto = Database['public']['Tables']['Productos']['Row']

export default function WelcomeComponent(): JSX.Element {
  const [, setLocation] = useLocation()
  const [productos, setProductos] = useState<{ Producto: Producto; cantidad: number }[]>([])
  const [encontrado, setEncontrado] = useState(false)
  const [formData, setFormData] = useState({
    Codigo: '',
    Cantidad: ''
  })
  const [total, setTotal] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase()
    }))
  }

  const getProductos = async (data): null => {
    const producto: Producto = await getProductoByCodigo(data.Codigo)
    if (producto) {
      if (await hayStockParaVenta(producto.Codigo, data.Cantidad)) {
        if (productos.length > 0) {
          setProductos([...productos, { Producto: producto, cantidad: data.Cantidad }])
        } else {
          setProductos([{ Producto: producto, cantidad: data.Cantidad }])
        }
      }
    }
  }

  const addRow = () => {
    return (
      <tr>
        <td>
          <button className="btn" onClick={() => addRow()}>
            <CirclePlus />
          </button>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    )
  }

  const handleSubmit = (data): JSX.Element => {
    try {
      console.log(data)
      //@ts-ignore no va a ser nulo, no seas bobo
      getProductos(data).then(() => {
        return (
          <div className="toast toast-center toast-middle">
            <div className="alert alert-error">
              <span>Producto encontrado, se agrego a la tabla</span>
            </div>
          </div>
        )
      })
    } catch (err) {
      return (
        <div className="toast toast-center toast-middle">
          <div className="alert alert-error">
            <span>Producto no encontrado, revise el codigo que ingresó</span>
          </div>
        </div>
      )
    }
    return (
      <div className="toast toast-center toast-middle">
        <div className="alert alert-error">
          <span>Producto no encontrado, revise el codigo que ingresó</span>
        </div>
      </div>
    )
  }

  useEffect(() => {
    let precioTotal = 0
    productos.forEach((producto) => {
      precioTotal += producto.Producto.Precio * producto.cantidad
    })
    setTotal(precioTotal)
  }, [productos])

  return (
    <>
      <div className="flex justify-between p-4">
        <div className="badge badge-soft badge-info badge-xl">
          <h1 className="text-lg">Sistema de gestion de lubricentro</h1>
        </div>
        <div className="flex items-end justify-end">
          <button
            className="btn btn-outline m-1"
            onClick={() => {
              setLocation('/ordenesDeTrabajo')
            }}
          >
            {' '}
            Ordenes de trabajo
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={() => {
              setLocation('/ordenesDeTrabajo')
            }}
          >
            {' '}
            Clientes
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={() => {
              setLocation('/ordenesDeTrabajo')
            }}
          >
            {' '}
            Productos
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={() => {
              setLocation('/ordenesDeTrabajo')
            }}
          >
            {' '}
            Vehiculos
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={() => {
              setLocation('/ordenesDeTrabajo')
            }}
          >
            {' '}
            Administrativo
          </button>
          <button
            className="btn btn-outline m-1"
            onClick={() => {
              setLocation('/ordenesDeTrabajo')
            }}
          >
            {' '}
            Gastos
          </button>
        </div>
      </div>
      <div className="p-24 m-2.5 ">
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-">
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
                      className="input input-bordered"
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
          <div className="badge badge-soft badge-success badge-xl m-5">Total $: {total} </div>
        </div>
        <div className="flex justify-start m-2.5 gap-4">
          <button className="btn btn-soft btn-accent">Cobrar</button>
          <button
            className="btn btn-soft btn-error"
            onClick={() => {
              setProductos([])
            }}
          >
            Cancelar venta
          </button>
        </div>
      </div>
    </>
  )
}
