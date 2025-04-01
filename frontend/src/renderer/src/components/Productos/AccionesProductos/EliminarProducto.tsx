import { useConsts } from '@renderer/Contexts/constsContext'
import { eliminarProducto } from '../../../../../servicies/productosService.js'
import { toast } from 'sonner'

export default function EliminarProducto({ onClose }: { onClose: () => void }): JSX.Element {
  const { productoSeleccionado } = useConsts()

  const handleEliminar = (): void => {
    const toastLoading = toast.loading('Eliminando producto...')
    console.log(productoSeleccionado.Codigo)
    eliminarProducto(productoSeleccionado.Codigo)
      .then(() => {
        toast.dismiss(toastLoading)
        toast.success('Producto eliminado correctamente')
        onClose()
      })
      .catch((err) => {
        toast.dismiss(toastLoading)
        toast.error('Error al eliminar el producto')
        console.log(err)
      })
  }

  return (
    <div className="h-80 w-150">
      <div className="flex flex-col gap-2  ">
        <p className="text-3xl"> ¿Esta seguro que desea eliminar el producto?</p>
        <p className="text-2xl">
          Usted va a eliminar el producto:{' '}
          <span className="font-bold">&quot;{productoSeleccionado.Descripcion}&quot; </span>
          de código: <span className="font-bold">&quot;{productoSeleccionado.Codigo}&quot;</span>
        </p>
        <div className="flex justify-between ">
          <button className="btn btn-error" onClick={handleEliminar}>
            Eliminar Producto
          </button>

          <button className="btn btn-warning" onClick={onClose}>
            Cambie de opinion
          </button>
        </div>
      </div>
    </div>
  )
}
