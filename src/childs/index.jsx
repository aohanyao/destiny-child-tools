import React from 'react'
import {connect} from 'react-redux'
import RouterLink from '../link.jsx'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'
import TablePagination from '@material-ui/core/TablePagination'
import ChildsTable from './table.jsx'
import ChildCards from './cards.jsx'
import Filters from './filters.jsx'
import EditButton from '../edit-button.jsx'
import {setPage, setFilter} from '../actions/child-list.js'
import routes from '../routes.js'
import {pushQueryParams} from '../history.js'

const Childs = ({
  childs,
  numToShow,
  sort,
  asc,
  page,
  stars,
  element,
  category,
  type,
  view,
  numMods,
  filter,
  setPage,
  setFilter
}) => {
  childs = childs.toList()
    .sortBy(child =>
      sort == 'variants'
        ? child.get('variants').size
        : child.get(sort) || (asc ? Infinity : -1 * Infinity)
    )
  if(stars) childs = childs.filter(child => child.get('stars') == stars)
  if(element) childs = childs.filter(child => child.get('element') == element)
  if(type) childs = childs.filter(child => child.get('type') == type)
  if(filter) {
    childs = childs.filter(child =>
      (child.get('name').toLowerCase() + child.get('id')).match(filter.toLowerCase())
    )
  }
  if(category) {
    switch(category) {
      case 'childs':
        childs = childs.filter(child => child.get('id').match(/^c\d\d\d/))
        break
      case 'monsters':
        childs = childs.filter(child => child.get('id').match(/^m\d\d\d/))
        break
      case 'spa':
        childs = childs.filter(child => child.get('id').match(/^sc\d\d\d/))
        break
    }

  }
  if(numMods) {
    childs = childs.filter(child => {
      switch(numMods) {
        case 'none':
          return child.get('numMods') == 0
        case '>0':
          return child.get('numMods') > 0
        case '>10':
          return child.get('numMods') >= 10
        case '<5':
          return child.get('numMods') < 5
        case 'nsfw':
          return child.get('numModsNSFW') > 0
        case 'sfw':
          return child.get('numMods') - child.get('numModsNSFW') > 0
      }
    })
  }
  if(!asc) childs = childs.reverse()
  const numChilds = childs.size
  childs = childs.slice(numToShow * page, numToShow * page + numToShow)
  const Pagination = () => (
    <Paper>
      <TablePagination
        component="div"
        rowsPerPageOptions={[10, 20, 50, 100, 200]}
        page={parseInt(page)}
        rowsPerPage={numToShow}
        count={numChilds}
        onChangeRowsPerPage={e => pushQueryParams({numToShow: e.target.value})}
        onChangePage={(e, newPage) => pushQueryParams({page: newPage})} />
    </Paper>
  )
  return (
    <div>
      <Box mb={2}>
        <EditButton />
        <Breadcrumbs aria-label="Breadcrumb">
          <Link component={RouterLink} to={routes.HOME}>Home</Link>
          <Typography color="textPrimary">Childs</Typography>
        </Breadcrumbs>
      </Box>
      <Filters />
      <Box mt={2}>
        <Pagination />
      </Box>
      {view == 'table'
        ? <ChildsTable childs={childs} numChilds={numChilds} />
        : <ChildCards childs={childs} />
      }
      <Box mt={2}>
        <Pagination />
      </Box>
    </div>
  )
}

export default connect(
  state => {
    const childList = state.get('childList')
    return {
      childs: state.get('childs'),
      numToShow: parseInt(childList.get('numToShow')),
      sort: childList.get('sort'),
      asc: childList.get('asc').toString() == 'true',
      page: parseInt(childList.get('page')),
      stars: childList.get('stars'),
      category: childList.get('category'),
      element: childList.get('element'),
      type: childList.get('type'),
      view: childList.get('view'),
      numMods: childList.get('numMods'),
      filter: childList.get('filter'),
    }
  },
  {setFilter, setPage}
)(Childs)
