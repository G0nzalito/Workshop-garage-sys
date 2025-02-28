import { Route, Switch } from 'wouter'
import WelcomeComponent from '@renderer/components/WelcomeComponent'
import ODTMain from '@renderer/components/Ordenes de trabajo/ODTMain'
import { useEffect } from 'react'
// eslint-disable-next-line prettier/prettier
// import got from 'got'
import axios from 'axios'

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
