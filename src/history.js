import queryString from 'query-string'
import {createBrowserHistory, createMemoryHistory, createLocation} from 'history'
import routes from './routes.js'

let history
export const createHistory = url => {
  const location = createLocation(url)
  history = (typeof __HTML__ !== 'undefined' && __HTML__)
    ? createMemoryHistory()
    : createBrowserHistory()
  history.listen((location, action) => {
    // location is an object like window.location
    console.log(action, location.pathname, location.state);
    // throw new Error('')
  });
  // if(typeof window == 'undefined') history.push(location)
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

export const pushQueryParams = params => {
  const parsed = Object.assign({}, queryString.parse(location.search), params)
  // console.log(parsed)
  // history.push(location.pathname + '?' + queryString.stringify(parsed))
  history.push({
    pathname: location.path,
    search: '?' + queryString.stringify(parsed)
  });
}
