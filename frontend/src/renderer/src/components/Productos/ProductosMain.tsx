export default function ProductosMain(): JSX.Element {
  return (
    <div className="flex w-full flex-col bg-base-100 text-white gap-2 p-4">
      <div>
        <h2 className="">
          <span className="badge badge-soft badge-info text-lg italic">
            Criterios de busqueda:{' '}
          </span>
        </h2>
        <div className="flex flex-col gap-2">
          <form>
            <fieldset>
              <legend className="fieldset-legend"> Descripción:</legend>
              <input type="text" className="input input-sm outline-1" placeholder="Ingresa la descripción..." />
            </fieldset>
            <fieldset>
              <legend className="fieldset-legend"> Marca:</legend>
              <select></select>
            </fieldset>
          </form>
        </div>
      </div>
      <div className="divider"></div>
      <div>LISTA DE PRODUCTOS</div>
    </div>
  )
}
