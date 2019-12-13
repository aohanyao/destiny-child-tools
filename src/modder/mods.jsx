import React from 'react'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import ModCard from '../mod-card.jsx'

const Mods = ({mods}) => {
  return (
    <Box my={4} ml={0}>
      <Grid container spacing={2}>
        {mods.map((mod, i) => {
          return <ModCard key={'mod-' + i} mod={mod} />
        }).toList()}
      </Grid>
    </Box>
  )
}

export default Mods
