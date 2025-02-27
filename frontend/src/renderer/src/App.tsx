import { Route, Switch } from 'wouter'
import WelcomeComponent from '@renderer/components/WelcomeComponent'
import ODTMain from '@renderer/components/Ordenes de trabajo/ODTMain'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <Switch>
      <Route path="/" component={WelcomeComponent} />
      <Route path="/OrdenesDeTrabajo" component={ODTMain} />
    </Switch>
  )
}

export default App
