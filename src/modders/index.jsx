import React from 'react'
import {connect} from 'react-redux'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import RouterLink from '../link.jsx'
import Link from '@material-ui/core/Link'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import routes from '../routes.js'
import ModderLink from '../links/modder.jsx'
import {setModdersSort} from '../actions/modders'

const TableChildCellLink = ({modder, children}) => (
  <TableCell>
    <ModderLink modder={modder}>{children}</ModderLink>
  </TableCell>
)

const Modders = ({modders, asc, sort, setModdersSort}) => {
  if(sort) modders = modders.sortBy(modder => modder.get(sort))
  if(!asc) modders = modders.reverse()
  const order = asc ? 'asc' : 'desc'
  const Sortable = ({name, children}) => (
    <TableCell sortDirection={order}>
      <TableSortLabel active={sort == name} direction={order}
        onClick={() => setModdersSort(name, sort == name
          ? !asc
          : name.match(/^(tier|stars|variants|element|type)/))}>
        {children}
      </TableSortLabel>
    </TableCell>
  ) 
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to={routes.HOME}>Home</Link>
        <Typography color="textPrimary">Modders</Typography>
      </Breadcrumbs>
      <Box ml={0} mb={2} mt={4}>
        <Paper>
          <Box px={2} py={1}>
            <Typography variant="h5">Modders</Typography>
          </Box>
        </Paper>
      </Box>
      <Box ml={0}>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <Sortable name="name">Name</Sortable>
                <Sortable name="mods">Mods</Sortable>
                <Sortable name="swaps">Swaps</Sortable>
                <Sortable name="nsfw">NSFW Mods</Sortable>
                <Sortable name="sfw">SFW(ish) Mods</Sortable>
              </TableRow>
            </TableHead>
            <TableBody>
              {modders.map(modder => (
                <TableRow key={modder.get('id') + 'list'}>    
                  <TableChildCellLink modder={modder}>
                    {modder.get('name')}
                  </TableChildCellLink>
                  <TableChildCellLink modder={modder}>
                    {modder.get('mods')}
                  </TableChildCellLink>
                  <TableChildCellLink modder={modder}>
                    {modder.get('swaps')}
                  </TableChildCellLink>
                  <TableChildCellLink modder={modder}>
                    {modder.get('nsfw')}
                  </TableChildCellLink>
                  <TableChildCellLink modder={modder}>
                    {modder.get('sfw')}
                  </TableChildCellLink>
                </TableRow>
              )).toArray()}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </div>
  )
}

export default connect(
  state => {
    return {
      modders: state.get('modders').get('data'),
      sort: state.get('modders').get('sort'),
      asc: state.get('modders').get('asc')
    }
  },
  {setModdersSort}
)(Modders)
