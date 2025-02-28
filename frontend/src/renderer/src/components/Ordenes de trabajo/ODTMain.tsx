import { useLocation } from 'wouter'

export default function ODTMain(): JSX.Element {
  const [, setLocation] = useLocation()

  return (
    <div>
      <h1>Ordenes de trabajo</h1>

      <button className="" onClick={() => setLocation('/')}>
        {' '}
        Volver al inicio
      </button>
    </div>
  )
}

