import { X } from 'lucide-react'

export default function Modal({
  open,
  onClose,
  Component,
  mainTitle,
  selectedCategoria
}: {
  open: boolean
  onClose: () => void
  Component: (props: { onClose: () => void; selectedCategoria?: number | null }) => JSX.Element
  mainTitle: string
  selectedCategoria?: number | null
}): JSX.Element | null {
  if (!open) return null

  return (
    <div
      onClick={() => onClose()}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}
    >
      {/* Este div es mi ventana emergente */}

      <div
        className={`bg-accent-foreground outline-1 rounded-xl shadow p-6 transition-all ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}  max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Este div es el contenido de mi ventana emergente */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-3xl flex justify-start justify-items-start p-4">
            {mainTitle}
          </h2>
          <button className="btn btn-error" onClick={() => onClose()}>
            <X />
          </button>
        </div>
        <Component onClose={() => onClose()} selectedCategoria={selectedCategoria} />
      </div>
    </div>
  )
}
