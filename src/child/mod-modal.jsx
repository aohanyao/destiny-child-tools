import React from 'react'
import {connect} from 'react-redux'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import {setModDetails} from '../actions/child.js'

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

const ModModal = ({modDetails, setModDetails}) => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setModDetails(null)
  }
  console.log('modDetails', modDetails)
  return (
    <div>
      <Dialog fullScreen open={Boolean(modDetails)} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Sound
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  )
}

export default connect(
  (state) => {
    return {
      mode: state.get('child').get('mode'),
      modDetails: state.get('child').get('modDetails')
    }
  },
  dispatch => ({
    setModDetails: mod => dispatch(setModDetails(mod))
  })
)(ModModal)
