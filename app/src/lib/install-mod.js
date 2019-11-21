import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {clientPaths} from './paths.js'
import stringifyMod from './stringify-mod.js'
import store from '../store.js'

export default mod => {
  const id = typeof mod == 'string' ? mod : stringifyMod(mod),
        matches = id.match(/([a-z]{1,2}\d{3})_\d{2}/),
        pckName = matches[0],
        paths = Object.keys(clientPaths).reduce((acc, client) => {
          const path = store.getState().get('settings').get(client + 'Path')
          if(path) acc[client] = path
          return acc
        }, {})
  RNFetchBlob
    .config({fileCache : true})
    .fetch('GET', `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}/${pckName}.pck`)
    .then((res) => {
      if(res.info().status == 200) {
        const installs = [],
              installedClients = []
        Object.keys(paths).forEach(client => {
          if(paths[client]) {
            installedClients.push(client)
            installs.push(RNFS.copyFile(res.path(), paths[client] + `files/asset/character/${pckName}.pck`))
          }
        })
        if(installs.length == 0) {
          alert('No versions of the game are enabled for mod installation. Check the app settings.')
        }
        Promise.all(installs).then(() => {
          RNFS.unlink(res.path()).then(() => {
            alert(
              `Mod installed to ${pckName} for:\n\n` +
              installedClients.join(', ') +
              `\n\nRestart Destiny Child if it\'s running.`
            )
          })
        })
      }
      
      else {
        alert('There may have been a problem downloading. Got status code ' + status)
      }
      }).catch(errorMessage => alert(errorMessage))
}
