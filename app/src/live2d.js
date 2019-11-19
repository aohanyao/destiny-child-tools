import React from 'react'
import {connect} from 'react-redux'
import {
  Text,
  View
} from 'react-native'
import {getStoragePermission} from './lib/permissions.js'
import {Title, Button} from 'react-native-paper'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {clientPaths} from './lib/paths.js'
import {WebView} from 'react-native-webview'

const installMod = props => {
  const {id, pckName} = props
  // alert(JSON.stringify(props))
  getStoragePermission().then(() => {
    RNFetchBlob
      .config({fileCache : true})
      .fetch('GET', `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}/${pckName}.pck`)
    // RNFetchBlob.fetch('GET', 'http://www.example.com/images/img1.png')
      .then((res) => {
        if(res.info().status == 200) {
          const installs = [],
                installedClients = []
          Object.keys(clientPaths).forEach(client => {
            if(props[client + 'Path']) {
              installedClients.push(client)
              installs.push(RNFS.copyFile(res.path(), props[client + 'Path'] + `files/asset/character/${pckName}.pck`))
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
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        alert(errorMessage)
        // error handling
      })
  })
}

const Live2D = props => {
  const {id} = props,
        pckName = id.match(/[a-z]{1,2}\d{3}_\d{2}/)[0]
  return (
    <View padding={20} height={500}>
      <Title>{id}</Title>
      <WebView
        source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/viewer.html?mN=${id}&size=2000&background=%23424242`}}
        automaticallyAdjustContentInsets={false}
      />
      <Button
        mode="contained"
        icon="cloud-download"
        onPress={() => installMod(Object.assign({}, props, {pckName})) } >
        Install This Mod
      </Button>
    </View>
  )
}

export default connect(
  state => {
    const props = {
      id: state.get('view').get('id')
    }
    Object.keys(clientPaths).forEach(client => {
      props[client + 'Path'] = state.get('settings').get(client + 'Path')
    })
    return props
  }
)(Live2D)