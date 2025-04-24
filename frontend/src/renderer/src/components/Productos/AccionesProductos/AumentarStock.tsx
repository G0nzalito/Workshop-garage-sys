import { useConsts } from '@renderer/Contexts/constsContext'
import { modificarStockProducto } from '../../../../../servicies/productosService.js'
import { toast } from 'sonner'

export default function AumentarStock({ onClose }: { onClose: (exito?: boolean) => void}): JSX.Element {
  const { productoSeleccionado, sucursalSeleccionada } = useConsts()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const toastLoading = toast.loading('Modificando Stock')
    const cantidad = parseInt(e.currentTarget.cantidad.value)
    modificarStockProducto(
      [{ Producto: productoSeleccionado, cantidad: cantidad }],
      sucursalSeleccionada,
      true
    )
      .then((res) => {
        if (res) {
          toast.dismiss(toastLoading)
          toast.success('Stock modificado correctamente')
          onClose(true)
        }
      })
      .catch((err) => {
        toast.dismiss(toastLoading)
        toast.error('Error al modificar el stock')
        console.log(err)
      })
  }

  return (
    <div className="h-80 w-100">
      <div className="flex flex-col space-y-6 ">
        <p>Producto: {productoSeleccionado.Descripcion}</p>
        <p>Ingrese la cantidad de producto a aumentar: </p>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="w-full flex">
            <input
              type="number"
              name="cantidad"
              className="flex border-2 border-gray-300 rounded-md p-2 w-full [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>
          <div className='flex '>

          <button className="btn btn-primary mt-5 w-2/3 justify-content-end ">Aumentar stock</button>
          </div>
        </form>
      </div>
    </div>
  )
}
