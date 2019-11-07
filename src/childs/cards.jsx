import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import ChildCard from '../child-card.jsx'

const useStyles = makeStyles({
  card: {
    marginRight: '1rem',
    paddingBottom: '1rem',
    display: 'inline-block'
  },
})

const Cards = ({childs}) => {
  const classes = useStyles()
  return <Box mt={2}>
    {childs.map(child =>
      <div
        className={classes.card}
        key={child.get('id') + 'card'}>
        <ChildCard child={child} />
      </div>
    )}
  </Box>
}

export default connect(
  state => ({
    mode: state.get('child').get('mode'),
    processing: state.get('processing')
  })
)(Cards)
