import { useConsts } from '@renderer/Contexts/constsContext'
import { modificarStockProducto } from '../../../../../servicies/productosService.js'
import { toast } from 'sonner'

export default function AumentarStock({
  onClose
}: {
  onClose: () => void
}): JSX.Element {
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
          onClose()
        }
      })
      .catch((err) => {
        toast.dismiss(toastLoading)
        toast.error('Error al modificar el stock')
        console.log(err)
      })
  }

  return (
    <div className="h-80 w-80">
      <div className="flex flex-col gap-2  ">
        <p>Producto: {productoSeleccionado.Descripcion}</p>
        <p>Ingrese la cantidad de producto a aumentar: </p>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            type="number"
            name="cantidad"
            className="border-2 border-gray-300 rounded-md p-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <button className="btn btn-primary">Aumentar stock</button>
        </form>
      </div>
    </div>
  )
}

