import { Route, Router } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import WelcomeComponent from '@renderer/components/WelcomeComponent'
// import ODTMain from '@renderer/components/Ordenes de trabajo/ODTMain'
import { Toaster } from '../../../components/ui/sonner'
import NavBar from '@renderer/specificComponents/Navbar'
import { ConstsProvider } from '@renderer/Contexts/constsContext'
import ProductosMain from '@renderer/components/Productos/ProductosMain'
import VehiculosMain from '@renderer/components/Vehiculos/VehiculosMain'
import OnDev from '@renderer/components/onDev'
import ClientesMain from '@renderer/components/Clientes/ClientesMain'
import ODTMain from '@renderer/components/Ordenes de trabajo/ODTMain'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <main>
      <ConstsProvider>
        <NavBar />

        <Router hook={useHashLocation}>
          <Route path="/" component={WelcomeComponent} />
          <Route path="/OrdenesDeTrabajo" component={ODTMain} />
          {/* Productos */}
          <Route path="/Productos" component={ProductosMain} />
          <Route path="/Vehiculos" component={VehiculosMain} />
          <Route path="/Clientes" component={ClientesMain} />
          <Route path="/Administrativo" component={() => OnDev({ nombre: 'Administrativo' })} />
          <Route path="/Gastos" component={() => OnDev({ nombre: 'Gastos' })} />
        </Router>
        <Toaster
          closeButton
          richColors
          toastOptions={{
            classNames: {
              icon: 'hidden'
            }
          }}
        />
      </ConstsProvider>
    </main>
  )
}

export default App
