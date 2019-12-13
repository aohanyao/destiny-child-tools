import React from 'react'
import Link from '@material-ui/core/Link'
import RouterLink from '../link.jsx'
import routes from '../routes.js'

const ChildLink = ({child, children}) => (
  <Link
    component={RouterLink} 
    to={routes.CHILD.replace('/:id', '/' + (typeof child == 'string' ? child : child.get('id')))}>
    {children}
  </Link>
)

export default ChildLink
