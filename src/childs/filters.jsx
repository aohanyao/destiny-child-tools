import React from 'react'
import {connect} from 'react-redux'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Filter from './filter.jsx'
import {setFilter} from '../actions/child-list.js'

const Filters = ({
  numToShow,
  stars,
  element,
  type,
  view,
  sort,
  numMods,
  asc,
  filter,
  setFilter
}) => {
  return (
    <Paper>
      <Box mb={2} p={2}>
        <Filter label="View as" value={view} name="view">
          <MenuItem value="table">Table</MenuItem>
          <MenuItem value="cards">Cards</MenuItem>
        </Filter>
        <Filter label="Show" value={numToShow} name="numToShow">
          <MenuItem value={10}>10 Childs</MenuItem>
          <MenuItem value={20}>20 Childs</MenuItem>
          <MenuItem value={50}>50 Childs</MenuItem>
          <MenuItem value={100}>100 Childs</MenuItem>
          <MenuItem value={200}>200 Childs</MenuItem>
        </Filter>
        <Filter label="Stars" value={stars} name="stars">
          <MenuItem value={false}>Any Stars</MenuItem>
          <MenuItem value={5}>5 Stars</MenuItem>
          <MenuItem value={4}>4 Stars</MenuItem>
          <MenuItem value={3}>3 Stars</MenuItem>
          <MenuItem value={2}>2 Stars</MenuItem>
          <MenuItem value={1}>1 Star</MenuItem>
        </Filter>
        <Filter label="Element" value={element} name="element">
          <MenuItem value={false}>Any Element</MenuItem>
          <MenuItem value={'light'}>Light</MenuItem>
          <MenuItem value={'dark'}>Dark</MenuItem>
          <MenuItem value={'fire'}>Fire</MenuItem>
          <MenuItem value={'water'}>Water</MenuItem>
          <MenuItem value={'grass'}>Grass</MenuItem>
        </Filter>
        <Filter label="Type" value={type} name="type">
          <MenuItem value={false}>Any Type</MenuItem>
          <MenuItem value={'attacker'}>Attacker</MenuItem>
          <MenuItem value={'tank'}>Tank</MenuItem>
          <MenuItem value={'healer'}>Healer</MenuItem>
          <MenuItem value={'support'}>Support</MenuItem>
          <MenuItem value={'debuffer'}>Debuffer</MenuItem>
        </Filter>
        <Filter label="Mods" value={numMods} name="numMods">
          <MenuItem value={false}>Any Number</MenuItem>
          <MenuItem value={'none'}>0 Mods</MenuItem>
          <MenuItem value={'>0'}>At Least 1</MenuItem>
          <MenuItem value={'>10'}>At Least 10</MenuItem>
          <MenuItem value={'<5'}>Less than 5</MenuItem>
          <MenuItem value={'nsfw'}>NSFW</MenuItem>
          <MenuItem value={'sfw'}>Safe FW</MenuItem>
        </Filter>
        <div style={{whiteSpace: 'nowrap', display: 'inline-block'}}>
          {view != 'table' &&
            <Filter label="Sort By" value={sort} name="sort">
              <MenuItem value={'id'}>Child ID</MenuItem>
              <MenuItem value={'name'}>Name</MenuItem>
              <MenuItem value={'stars'}>Stars</MenuItem>
              <MenuItem value={'type'}>Type</MenuItem>
              <MenuItem value={'element'}>Element</MenuItem>
              <MenuItem value={'tierPVP'}>Tier PVP</MenuItem>
              <MenuItem value={'tierPVE'}>Tier PVE</MenuItem>
              <MenuItem value={'tierRaid'}>Tier Raid</MenuItem>
              <MenuItem value={'tierBoss'}>Tier Boss</MenuItem>
              <MenuItem value={'numMods'}>Number of Mods</MenuItem>
            </Filter>
          }
          {view != 'table' &&
            <Filter label="Order" value={asc} name="asc">
              <MenuItem value={true}>Ascending</MenuItem>
              <MenuItem value={false}>Descending</MenuItem>
            </Filter>
          }
        </div>
        <TextField
          label="Filter by name or ID"
          value={filter}
          onChange={e => setFilter('filter', e.target.value)}
          margin="normal"
        />
      </Box>
    </Paper>
  )
}

export default connect(
  state => {
    const childList = state.get('childList')
    return {
      numToShow: childList.get('numToShow'),
      stars: childList.get('stars'),
      element: childList.get('element'),
      type: childList.get('type'),
      view: childList.get('view'),
      sort: childList.get('sort'),
      asc: childList.get('asc'),
      numMods: childList.get('numMods'),
      filter: childList.get('filter'),
    }
  },
  {setFilter}
)(Filters)
