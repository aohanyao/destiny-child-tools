import React from 'react'
import {connect} from 'react-redux'
import Link from '@material-ui/core/Link'
import RouterLink from '../link.jsx'
import routes from '../routes.js'
import getModderKey from '../lib/get-modder-key'

const ModderLink = ({modder, children, modders}) => {
  modder = typeof modder == 'string'
    ? modders.find(m => m.get('id') == getModderKey(modder))
    : modder
  return <Link component={RouterLink} to={routes.MODDER.replace('/:id', '/' + modder.get('id'))}>{children}</Link>
}

export default connect(
  state => ({
    modders: state.get('modders').get('data')
  })
)(ModderLink)
