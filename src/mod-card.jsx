import React from 'react'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import DownloadIcon from '@material-ui/icons/CloudDownload'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import {setModDetails} from './actions/child.js'
import {Censor} from './censorship.jsx'
import ModderLink from './links/modder.jsx'
import ChildLink from './links/child.jsx'

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

const ModCard = ({mod}) => {
  const classes = useStyles(),
        modPath = stringify(mod)
  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
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
              <ChildLink child={mod.get('child')}>{mod.get('child')}_{mod.get('variant')}</ChildLink>{' '}
              {mod.get('name')}<br />by {' '}
              <ModderLink modder={mod.get('modder')}>{mod.get('modder')}</ModderLink>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                title="Download"
                className={classes.download}
                href={`/destiny-child-tools/live2d/assets/${modPath}/${mod.get('child')}_${mod.get('variant')}.pck`}>
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
            <a 
              style={{
                textAlign: 'center', 
                display: 'block', 
                minHeight: '300px',
                background: `url(/destiny-child-tools/live2d/assets/${modPath}/preview-424242.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
              href={`/destiny-child-tools/live2d/viewer.html?mN=${modPath}&size=1000&background=%23424242`}
              target="_blank"></a>
          </Censor>
        </CardContent>
      </Card>
    </Grid>
  )
}
 export default ModCard