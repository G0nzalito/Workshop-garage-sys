import { Route, Switch } from 'wouter'
import WelcomeComponent from '@renderer/components/WelcomeComponent'
import ODTMain from '@renderer/components/Ordenes de trabajo/ODTMain'
import { Toaster } from '../../../components/ui/sonner'
import NavBar from '@renderer/specificComponents/Navbar'
import { ConstsProvider } from '@renderer/Contexts/constsContext'
import ProductosMain from '@renderer/components/Productos/ProductosMain'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <ConstsProvider>
      <>
        <NavBar />

        <main>
          <Switch>
            <Route path="/" component={WelcomeComponent} />
            <Route path="/OrdenesDeTrabajo" component={ODTMain} />
            {/* Productos */}
            <Route path="/Productos" component={ProductosMain}/>
          </Switch>
        </main>
        <Toaster
          closeButton
        />
      </>
    </ConstsProvider>
  )
}

export default App
