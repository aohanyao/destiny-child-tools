import React from 'react'
import {connect} from 'react-redux'
import Link from 'redux-first-router-link'
import {makeStyles} from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import AppBar from '@material-ui/core/AppBar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew'
import {fetchChilds} from './actions/childs.js'
import {fetchMods} from './actions/mods.js'
import Child from './child/index.jsx'
import Childs from './childs/index.jsx'
import Censorship from './censorship.jsx'
import Home from './home/index.jsx'
import NotFound from './not-found.jsx'
import SelectChild from './select-child.js'
import {Censor} from './censorship.jsx'
import routes from './routes.js'

const pages = {
  HOME: Home,
  CHILDS: Childs,
  CHILD: Child
}

const useStyles = makeStyles(theme => ({
  flexGrow: {
    flexGrow: 1,
  }
}))

const App = function({fetchChilds, fetchMods, page, htmlMode}) {
  if(!htmlMode) {
    fetchChilds()
    fetchMods()
  }
  const classes = useStyles(),
        Page = pages[page] || NotFound
  return (
    <React.Fragment>
      <div className={classes.flexGrow}>
        <AppBar position="static">
          <Toolbar>
            <Box mr={2}>
              <Link to={routes.HOME}>
                <Censor min={1} fallback={<AccessibilityNewIcon />}>
                  <img src="/destiny-child-tools/icon.png" height="32" />
                </Censor>
              </Link>
            </Box>
            <Typography variant="h6" className={classes.flexGrow}>
              Destiny Child Tools
            </Typography>
            <SelectChild />
          </Toolbar>
        </AppBar>
      </div>
      <Box p={2}>
        <Page />
        <Box pt={2}>
          <Censorship/>
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default connect(
  state => ({
    page: state.get('page')
  }),
  {fetchChilds, fetchMods}
)(App)
