import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import {createBrowserStore} from './store.js'
import App from './app.jsx'
import theme from './theme.js'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <Provider store={createBrowserStore()}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

module.hot.accept();
