import { useEffect } from 'react'
import axios from 'axios'
import { Route, Switch } from 'wouter'
import WelcomeComponent from '@renderer/components/WelcomeComponent'
import ODTMain from '@renderer/components/Ordenes de trabajo/ODTMain'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  useEffect(() => {
    axios
      .get('http://localhost:4001/api/vehiculos/all')
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <Switch>
      <Route path="/" component={WelcomeComponent} />
      <Route path="/OrdenesDeTrabajo" component={ODTMain} />
    </Switch>
  )
}

export default App
