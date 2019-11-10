import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import IconButton from '@material-ui/core/IconButton'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import {setModDetails} from '../actions/child.js'
import {Censor} from '../censorship.jsx'
import ModModal from './mod-modal.jsx'

const useStyles = makeStyles({
  live2d: {
    // minHeight: 250,
  },
  download: {
    position: 'relative',
    left: '-.5em',
    top: '-.2em'
  },
  cardContent: {
    position: 'relative'
  },
  modelInfo: {
    position: 'absolute',
    top: '50px',
    right: '5px',
    zIndex: 100
  }
})

const stringify = mod =>
  mod.get('child') + '_' +
  mod.get('variant') + '-' +
  mod.get('modder').toLowerCase().replace(/\s/g, '_') + '-' +
  mod.get('name').toLowerCase().replace(/\s/g, '_')

const Mods = ({child, mods, mode, setModDetails}) => {
  const id = child.get('id'),
        classes = useStyles()
  return mods
    ? (
      <Box mt={4} ml={0}>
        <ModModal />
        <Box ml={0} mb={2}>
          <Paper>
            <Box pl={2} py={1}>
              <Typography variant="h5">
                {child.get('name')} Mods
              </Typography>
              <Typography variant="body1">
                <Link href="http://wiki.anime-sharing.com/hgames/index.php?title=Destiny_Child/Modding" target="_blank">
                  Installation instructions
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box>
        <Grid container spacing={2}>
          {child.get('variants').toOrderedMap().sortBy((_, v) => parseInt(v)).map((_, variantId) =>
            mods.filter(mod => mod.get('variant') == variantId).sortBy(mod => mod.get('nsfw')).reverse().map((mod, i) => {
              const modPath = stringify(mod)
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={mod.get('modder') + mod.get('name') + i}>
                  <Card>
                    <CardContent className={classes.cardContent}>
                      {mod.get('modelInfo') &&
                        <IconButton
                          title="Model Info - This mod requires modifying model_info.json"
                          className={classes.modelInfo}
                          onClick={() => setModDetails(mod)}>
                          <SettingsApplicationsIcon />
                        </IconButton>
                      }
                      <Grid container>
                        <Grid item xs={11}>
                          <Button
                            href={`/destiny-child-tools/live2d/viewer.html?mN=${modPath}&size=1000`}
                            target="_blank"
                            color="primary">
                            {child.get('id')}_{variantId} {mod.get('name')} by {mod.get('modder')} {' '}
                          </Button>
                        </Grid>
                        <Grid item xs={1}>
                          <IconButton
                            title="Download"
                            className={classes.download}
                            href={`/destiny-child-tools/live2d/assets/${modPath}/${id}_${variantId}.pck`}>
                            <DownloadIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <Censor min={mod.get('nsfw') ? 0 : 1}
                        fallback={
                          <div style={{marginLeft: '1em'}}>
                            <p>Censored! (NSFW)</p>
                            <p>Change your censorship settings in the footer if you want to see this.</p>
                          </div>
                        }>
                        <iframe
                          style={{
                            width: '100%',
                            height: '350px',
                            maxWidth: '100%',
                            border: 'none',
                            position: 'relative',
                            top: '-.5em',
                            overflow: 'hidden'
                          }}
                          className={classes.live2d}
                          scrolling="no"
                          seamless="seamless"
                          src={`/destiny-child-tools/live2d/viewer.html?mN=${modPath}&size=500`} />
                      </Censor>
                    </CardContent>
                  </Card>
                </Grid>
              )
            })
          ).toList()}
        </Grid>
        <Box mt={2}>
          <Typography align="right">
            <Button
              href="https://github.com/LokiCoder/destiny-child-tools/issues/new"
              target="_blank">
              Submit Mod / Report Issue
            </Button>
          </Typography>
        </Box>
        {mode == 'edit' &&
          <Box mt={2}>
            <Box mb={1}>
              <Typography variant="h6">
                Upload new mod
              </Typography>
            </Box>
            <form method="post" encType="multipart/form-data" action="/api/mod">
              <input type="hidden" value={document.location} name="backUrl" />
              <p>Modder: <input type="text" name="modder" /></p>
              <p>Name: <input type="text" name="name" /></p>
              <p>NSFW? <input type="checkbox" name="nsfw" value="nsfw" /></p>
              <p>
                PCK file:
                {' '}
                <input type="file" name="pck" />
                <input type="submit" />
              </p>
            </form>
          </Box>
        }

      </Box>
    )
    : null
}

export default connect(
  (state, {child}) => {
    return {
      mods: state.get('mods').filter(mod => mod.get('child') == child.get('id')),
      mode: state.get('child').get('mode')
    }
  },
  dispatch => ({
    setModDetails: mod => dispatch(setModDetails(mod))
  })
)(Mods)
