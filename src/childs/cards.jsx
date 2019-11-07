import React from 'react'
import {connect} from 'react-redux'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import ChildCard from '../child-card.jsx'

const Cards = ({childs}) => {
  return <Box mt={2}>
    <Grid container spacing={2}>
      {childs.map(child =>
        <Grid xs={12} sm={6} md={4} lg={3}
          item
          key={child.get('id') + 'card'}>
          <ChildCard child={child} />
        </Grid>
      )}
    </Grid>
  </Box>
}

export default connect(
  state => ({
    mode: state.get('child').get('mode'),
    processing: state.get('processing')
  })
)(Cards)
