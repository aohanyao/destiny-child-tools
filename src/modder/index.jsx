import React from 'react'
import {connect} from 'react-redux'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import RouterLink from '../link.jsx'
import Link from '@material-ui/core/Link'
import routes from '../routes.js'
import getModderKey from '../lib/get-modder-key'
import Mods from './mods.jsx'

const Modder = ({modders, mods, id}) => {
  const modder = modders.find(m => m.get('id') == id)
  mods = mods.filter(m => getModderKey(m.get('modder')) == id)
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to={routes.HOME}>Home</Link>
        <Link component={RouterLink} to={routes.MODDERS}>Modders</Link>
        <Typography color="textPrimary">{modder.get('name')}</Typography>
      </Breadcrumbs>
      <Box ml={0} mb={2} mt={4}>
        <Paper>
          <Box px={2} py={1}>
            <Typography variant="h5">{modder.get('name')}'s Mods</Typography>
          </Box>
        </Paper>
      </Box>
      <Mods mods={mods} />
    </div>
  )
}

export default connect(
  state => {
    return {
      id: state.get('location').payload.id,
      modders: state.get('modders').get('data'),
      mods: state.get('mods')
    }
  }
)(Modder)
