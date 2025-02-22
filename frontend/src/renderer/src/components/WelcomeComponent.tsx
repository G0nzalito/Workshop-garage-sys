import { useLocation } from 'wouter'

export default function WelcomeComponent(): JSX.Element {
  const [, setLocation] = useLocation()
  return (
    <div>
      <h1>Welcome to the Electron React App</h1>
      <button
        onClick={() => {
          setLocation('/Vehiculos')
        }}
      >
        {' '}
        Ordenes de trabajo
      </button>
    </div>
  )
}
