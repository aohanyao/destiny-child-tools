import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Provider} from 'react-redux'
import {ServerStyleSheets, ThemeProvider} from '@material-ui/styles'
import App from '../src/app.jsx'
import {createBrowserStore} from '../src/store.js'
import theme from '../src/theme.js'

export const renderHtml = url => {
  const StyledApp = () => (
    <Provider store={createBrowserStore(url)}>
      <ThemeProvider theme={theme}>
        <App htmlMode={true} />
      </ThemeProvider>
    </Provider>
  )
  const sheets = new ServerStyleSheets()
  const html = ReactDOMServer.renderToString(sheets.collect(<StyledApp />))
  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Destiny Child Mods &amp; Tools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body {
            margin: 0;
            padding: 0;
            font-family: arial, sans-sans-serif;
          }
          ${sheets.toString()}
        </style>
      </head>
      <body>
        <div id="root">${html}</div>
        <script type="text/javascript" src="/destiny-child-tools/bundle.js"></script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-49949240-9"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-49949240-9');
        </script>
      </body>
    </html>
  `
}
