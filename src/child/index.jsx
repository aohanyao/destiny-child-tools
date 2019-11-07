import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import RouterLink from '../link.jsx'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import {Censor} from '../censorship.jsx'
import EditButton from '../edit-button.jsx'
import ChildCard from '../child-card.jsx'
import routes from '../routes.js'
import Mods from './mods.jsx'

const useStyles = makeStyles({
  live2d: {
    minHeight: 275,
  },
  download: {
    float: 'right'
  }
})

const Child = ({child, mods}) => {
  const classes = useStyles()
  if(!child) return <div>Loading ...</div>
  const name = child.get('name'),
        id = child.get('id'),
        variants = child.get('variants')
  return (
    <div>
      <EditButton />
      <Breadcrumbs aria-label="breadcrumb">
        <Link component={RouterLink} to={routes.HOME}>Home</Link>
        <Link component={RouterLink} to={routes.CHILDS}>Childs</Link>
        <Typography color="textPrimary">{name} ({id})</Typography>
      </Breadcrumbs>
      <Box mt={2} mb={2}>
        <ChildCard child={child} />
      </Box>
      <Box ml={0} mb={2} mt={4}>
        <Paper>
          <Box px={2} py={1}>
            <Typography variant="h5">{name} Variants</Typography>
          </Box>
        </Paper>
      </Box>
      <Box ml={0}>
        <Grid container spacing={2}>
          {variants.toOrderedMap().sortBy((v, k) => k)
            .map((variant, vId) => variant && variant.get &&
              <Grid item xs={12} sm={6} md={4} lg={3} key={id + vId}>
                <Card>
                  <CardContent className={classes.cardContent}>
                    <IconButton
                      title="Download"
                      className={classes.download}
                      href={`/destiny-child-tools/live2d/assets/${id}_${vId}/${id}_${vId}.pck`}>
                      <DownloadIcon />
                    </IconButton>
                    <Button
                      href={`/destiny-child-tools/live2d/?model=${id}_${vId}`}
                      target="_blank"
                      color="primary">
                      {variant.get('title')} {name} ({id}_{vId})
                    </Button>
                    <Grid container>
                      <Grid item xs={4}>
                        <Censor min={1}>
                          <img src={`/destiny-child-tools/img/childs/portraits/${id}_${vId}.png`}
                            height="250"
                            alt={`${variant.get('title')} ${name} Portrait`} />
                        </Censor>
                      </Grid>
                      <Grid item xs={8}>
                        <Censor min={1}>
                          <iframe
                            style={{
                              width: '100%',
                              height: '100%',
                              maxWidth: '100%',
                              border: 'none',
                              overflow: 'hidden'
                            }}
                            className={classes.live2d}
                            scrolling="no"
                            seamless="seamless"
                            src={`/destiny-child-tools/live2d/viewer.html?mN=${id}_${vId}&size=500`} />
                        </Censor>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ).toList()
          }
        </Grid>
      </Box>
      <Mods mods={mods} child={child} />
    </div>
  )
}

export default connect(
  state => {
    const child = state.get('childs').get(state.get('location').payload.id)
    return {
      child,
      mode: state.get('child').get('mode'),
      mods: child && state.get('mods').get(child.get('id'))
    }
  }
)(Child)
