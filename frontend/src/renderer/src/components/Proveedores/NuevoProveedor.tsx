import { useState } from 'react'

export default function NuevoProveedor(): JSX.Element {
  const [formData, setFormData] = useState({
    nombre: ''
  })

  const handleChange = (e): undefined => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <div className="h-46 w-96">
      <form
        id="formNuevoProveedor"
        className="grid grid-cols-[180px_1fr] gap-y-4 p-4 max-w-2xl mx-auto"
        onSubmit={(e) => {e.preventDefault()
          console.log(formData)
        }}
      >
        <span className="text-right pr-4 self-center font-bold">Nombre Proveedor: </span>
        <input
          type="text"
          className="input input-bordered appearance-none w-full"
          placeholder="Nombre del proveedor..."
          onChange={handleChange}
          name="nombre"
        />

        <div className="col-span-2 flex justify-end mt-4">
          <button className="btn btn-success btn-soft">Guardar Proveedor</button>
        </div>
      </form>
    </div>
  )
}

