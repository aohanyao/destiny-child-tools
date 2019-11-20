import React from 'react'
import {connect} from 'react-redux'
import copyToClipoard from 'copy-to-clipboard'
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import Paper from '@material-ui/core/Paper'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import {setModDetails} from '../actions/child.js'
import stringifyMod from '../lib/stringify-mod'

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const copy = text => {
  if(copyToClipoard(text)) {
    alert('The following was coppied to your clipboard: \n\n' + text)
  }
}

const ModModal = ({mod, setModDetails, child}) => {
  if(!mod) return null
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setModDetails(null)
  }
  const modPath = stringifyMod(mod),
        modelInfo = JSON.stringify(mod.get('modelInfo'), null, 2)
  return (
    <div>
      <Dialog fullScreen open={Boolean(mod)} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {child.get('name')} {mod.get('name')} by {mod.get('modder')}
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={12} s={6}>
            <iframe
              style={{
                width: '100%',
                height: '500px',
                maxWidth: '100%',
                border: 'none',
                position: 'relative',
                top: '-.5em',
                overflow: 'hidden'
              }}
              scrolling="no"
              seamless="seamless"
              src={`/destiny-child-tools/live2d/viewer.html?mN=${modPath}&size=500`} />
          </Grid>
          <Grid item xs={12} s={6}>
            {mod.get('modelInfo') &&
              <Paper>
                <Typography>
                  This mod requires editing <em>files/asset/character/model_info.json</em> for proper placement. Find where it says <em>"{mod.get('child')}_{mod.get('variant')}":</em> and replace the value with the following new data:
                  <Button onClick={() => copy(modelInfo)}>
                    Copy to Clipoard
                  </Button>
                </Typography>
                <pre onClick={() => copy(modelInfo)}>{modelInfo}</pre>
              </Paper>
            }
          </Grid>
        </Grid>
      </Dialog>
    </div>
  )
}

export default connect(
  (state) => {
    const mod = state.get('child').get('modDetails')
    return {
      mode: state.get('child').get('mode'),
      mod,
      child: mod && state.getIn(['childs', mod.get('child')])
    }
  },
  dispatch => ({
    setModDetails: mod => dispatch(setModDetails(mod))
  })
)(ModModal)
