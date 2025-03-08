import { useLocation } from 'wouter'

export default function NavBar(): JSX.Element {
  const [, setLocation] = useLocation()

  return (
    <div className="flex justify-between p-4 bg-base-100">
      <div className="badge badge-soft badge-info badge-xl">
        <button className="btn btn-ghost" onClick={() => setLocation('/')}>
        <h1 className="text-lg">Sistema de gestion de lubricentro</h1>
        </button>
      </div>
      <div className="flex items-end justify-end">
        <button
          className="btn btn-outline m-1 text-white"
          onClick={() => {
            setLocation('/ordenesDeTrabajo')
          }}
        >
          {' '}
          Ordenes de trabajo
        </button>
        <button
          className="btn btn-outline m-1 text-white"
          onClick={() => {
            setLocation('/ordenesDeTrabajo')
          }}
        >
          {' '}
          Clientes
        </button>
        <button
          className="btn btn-outline m-1 text-white"
          onClick={() => {
            setLocation('/Productos')
          }}
        >
          {' '}
          Productos
        </button>
        <button
          className="btn btn-outline m-1 text-white"
          onClick={() => {
            setLocation('/ordenesDeTrabajo')
          }}
        >
          {' '}
          Vehiculos
        </button>
        <button
          className="btn btn-outline m-1 text-white"
          onClick={() => {
            setLocation('/ordenesDeTrabajo')
          }}
        >
          {' '}
          Administrativo
        </button>
        <button
          className="btn btn-outline m-1 text-white"
          onClick={() => {
            setLocation('/ordenesDeTrabajo')
          }}
        >
          {' '}
          Gastos
        </button>
      </div>
    </div>
  )
}

