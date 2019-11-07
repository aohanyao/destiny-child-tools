import React from 'react'
import ReactDOMServer from 'react-dom/server'
import {Provider} from 'react-redux'
import {ServerStyleSheets, ThemeProvider} from '@material-ui/styles'
import App from '../src/app.jsx'
import {createBrowserStore} from '../src/store.js'
import theme from '../src/theme.js'
import childData from '../docs/data/childs.json'

export const renderHtml = url => {
  const StyledApp = () => (
    <Provider store={createBrowserStore(url)}>
      <ThemeProvider theme={theme}>
        <App htmlMode={true} />
      </ThemeProvider>
    </Provider>
  )
  const sheets = new ServerStyleSheets(),
        html = ReactDOMServer.renderToString(sheets.collect(<StyledApp />)),
        childId = url.match(/\/childs\/([^/]+)/),
        childDb = url.match(/\/childs\/?$/),
        title = childId
          ? ReactDOMServer.renderToString(childData[childId[1]].name) + ' | '
          : childDb
            ? 'Childs Database | '
            : ''
  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}Destiny Child Mods &amp; Tools</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          body {
            margin: 0;
            padding: 0;
            font-family: arial, sans-sans-serif;
            background: #333;
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
