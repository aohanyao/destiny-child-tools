import React from 'react'
import {connect} from 'react-redux'
import Link from 'redux-first-router-link'
import Toolbar from '@material-ui/core/Toolbar'
import Hidden from '@material-ui/core/Hidden'
import AppBar from '@material-ui/core/AppBar'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
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

const App = function({page}) {
  const Page = pages[page] || NotFound
  return (
    <React.Fragment>
      <AppBar position="absolute" color="secondary">
        <Toolbar>
          <div style={{width: '100%'}}>
            <Box my={2} zIndex="tooltip">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Link to={routes.HOME}>
                    <Censor min={1} fallback={<AccessibilityNewIcon style={{float: 'left', marginRight: '1em'}} />}>
                      <img src="/destiny-child-tools/icon.png" height="32" style={{float: 'left', marginRight: '1em'}}/>
                    </Censor>
                  </Link>
                  <Typography variant="h6">
                    Destiny Child Tools
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div style={{marginTop: '-.6em'}}>
                    <SelectChild />
                  </div>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
      <Hidden smUp>
        <div style={{height: '120px'}} />
      </Hidden>
      <Hidden xsDown>
        <div style={{height: '70px'}} />
      </Hidden>
      <Box p={2}>
        <Page />
        <Box my={2}>
          <Paper>
            <Box p={1}>
              <Censorship/>
            </Box>
          </Paper>
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
