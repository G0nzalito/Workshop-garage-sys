export default function PopUp({
  open,
  onClose,
  Component,
  mainTitle
}: {
  open: boolean
  onClose: () => void
  Component: () => JSX.Element
  mainTitle: string
}): JSX.Element {
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-colors ${open ? 'visible bg-black/20' : 'invisible'}`}
    >
      {/* Este div es mi ventana emergente */}

      <div
        className={`bg-accent-foreground outline-1 rounded-xl shadow p-6 transition-all ${open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Este div es el contenido de mi ventana emergente */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-3xl flex justify-start justify-items-start p-4">
            {mainTitle}
          </h2>
        </div>
        <Component onClose={onClose} open={open}/>
      </div>
    </div>
  )
}

