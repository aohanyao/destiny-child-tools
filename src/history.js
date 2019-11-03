import {createBrowserHistory, createMemoryHistory, createLocation} from 'history'
import routes from './routes.js'

export const createHistory = url => {
  const location = createLocation(url)
  const history = typeof window == 'undefined'
    ? createMemoryHistory()
    : createBrowserHistory()
  if(typeof window == 'undefined') history.push(location)
  return history
}

export const getHistory = () => history

export const pushRoute = (route, params) => {
  history.push(
    Object.keys(params).reduce((acc, param) => {
      return acc.replace(':' + param, params[param])
    }, routes[route])
  )
}
