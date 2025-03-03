import { Route, Switch } from 'wouter'
import WelcomeComponent from '@renderer/components/WelcomeComponent'
import ODTMain from '@renderer/components/Ordenes de trabajo/ODTMain'
import { Toaster } from '../../../components/ui/sonner'
import NavBar from '@renderer/specificComponents/Navbar'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <NavBar />

      <main>
        <Switch>
          <Route path="/" component={WelcomeComponent} />
          <Route path="/OrdenesDeTrabajo" component={ODTMain} />
        </Switch>
      </main>
      <Toaster
        closeButton
        toastOptions={{
          classNames: {
            toast: 'alert', // Clase base
            success: 'alert-success', // Clase para toasts de éxito
            error: 'alert-error', // Clase para toasts de error
            warning: 'alert-warning', // Clase para toasts de advertencia
            info: 'alert-info' // Clase para toasts de información
          }
        }}
      />
    </>
  )
}

export default App
