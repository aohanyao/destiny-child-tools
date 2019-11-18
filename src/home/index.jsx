import React from 'react'
import List from '@material-ui/core/List'
import Paper from '@material-ui/core/Paper'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ImageIcon from '@material-ui/icons/Image'
import FaceIcon from '@material-ui/icons/Face'
import BuildIcon from '@material-ui/icons/Build'
import StorageIcon from '@material-ui/icons/Storage'
import ComputerIcon from '@material-ui/icons/Computer'
import OpenInNewIcon from '@material-ui/icons/OpenInNew'
import ExtensionIcon from '@material-ui/icons/Extension'
import Divider from '@material-ui/core/Divider'
import RouterLink from '../link.jsx'

const ListLink = ({href, text, Icon}) => (
  <ListItem button component="a" href={href} target="_blank">
    {Icon && <ListItemIcon><Icon /></ListItemIcon>}
    <ListItemText primary={text} />
    <OpenInNewIcon />
  </ListItem>
)

const Home = () => (
  <Paper>
    <List component="nav">
      <ListItem button component={RouterLink} to="/destiny-child-tools/childs">
        <ListItemIcon><FaceIcon /></ListItemIcon>
        <ListItemText primary="Childs &amp; Mods Database" />
      </ListItem>
      <Divider />
      <ListLink text="Live2D Viewer" href="./live2d/" Icon={ImageIcon} />
      <ListLink
        text="Arsylk's dctools"
        href="https://arsylk.pythonanywhere.com/apk/view_models"
        Icon={ExtensionIcon} />
      <ListLink
        text="Modding Wiki (nsfw)"
        href="http://wiki.anime-sharing.com/hgames/index.php?title=Destiny_Child/Mods"
        Icon={BuildIcon} />
      <ListLink
        text="GitHub Sourcecode"
        href="https://github.com/LokiCoder/destiny-child-tools"
        Icon={ComputerIcon} />
      <ListLink
        text="Anubis' All-In-One Collection"
        href="https://mega.nz/#F!Rj5ESaDA!DgKHJfyMdZ-usnwWdpf1Pw"
        Icon={StorageIcon} />
      <ListLink
        text="Discord Google Drive"
        href="https://drive.google.com/drive/folders/0BwMBdCPOVYu0WEs0VVBhNG9ZZms"
        Icon={StorageIcon} />
      <ListLink
        text="Original PCK files (outdated?)"
        href="https://drive.google.com/drive/u/0/folders/1ZgUD3gnXgyb5Vtu-3yD5pb0kM2ZUTugT"
        Icon={ExtensionIcon} />
    </List>
  </Paper>
)

export default Home
