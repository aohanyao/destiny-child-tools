import {grey, teal} from '@material-ui/core/colors'
import {createMuiTheme} from '@material-ui/core/styles'

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: teal[200],
      contrastText: grey[50]
    },
    secondary: {
      main: grey[800],
    },
    // error: {
    //   main: red.A400,
    // },
    // background: {
    //   default: '#000',
    // },
  },
})

export default theme
