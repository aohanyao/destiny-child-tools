import React from 'react'
import {connect} from 'react-redux'
import {
  Text,
  View
} from 'react-native'
import {getStoragePermission} from './lib/permissions.js'
import {globalAssetPath, krAssetPath} from './lib/paths.js'
import {Title, Button} from 'react-native-paper'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {goBack} from './actions/view.js'
import {WebView} from 'react-native-webview'

const installMod = ({id, pckName, globalInstalled, krInstalled}) => {
  getStoragePermission().then(() => {
    RNFS.readDir(globalAssetPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        // alert(JSON.stringify(result, null, 2))
        RNFetchBlob
          .config({
            //path: globalAssetPath + `character/${pckName}.pck`
            fileCache : true
          })
          .fetch('GET', `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}/${pckName}.pck`)
        // RNFetchBlob.fetch('GET', 'http://www.example.com/images/img1.png')
          .then((res) => {
            let status = res.info().status;
            
            if(status == 200) {
              const installs = []
              if(globalInstalled) {
                installs.push(RNFS.copyFile(res.path(), krAssetPath + `character/${pckName}.pck`))
              }
              if(krInstalled) {
                installs.push(RNFS.copyFile(res.path(), globalAssetPath + `character/${pckName}.pck`))
              }
              if(installs.length == 0) {
                alert('No versions of the game are enabled for mod installation. Check the app settings.')
              }
              Promise.all(installs).then(() => {
                RNFS.unlink(res.path()).then(() => {
                  alert(
                    `sMod installed to ${pckName} for:\n\n` +
                    (globalInstalled ? 'Global\n' : '') +
                    (krInstalled ? 'Korea\n' : '') +
                    `\nRestart Destiny Child if it\'s running.`
                  )
                })
              })
            }
            else {
              alert('There may have been a problem downloading. Got status code ' + status)
            }
          })
          // Something went wrong:
          .catch((errorMessage, statusCode) => {
            alert(errorMessage)
            // error handling
          })
    })
  })
}

const Live2D = ({id, goBack, globalInstalled, krInstalled}) => {
  const pckName = id.match(/[a-z]{1,2}\d{3}_\d{2}/)[0]
  return (
    <View padding={20} height={500}>
      <Title>{id} {globalInstalled + ''}</Title>
      <WebView
        source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/viewer.html?mN=${id}&size=1000&background=%23424242`}}
        height={900}
      />
      <Button
        mode="contained"
        icon="cloud-download"
        onPress={() => installMod({
          id,
          pckName,
          globalInstalled, 
          krInstalled
        })} >
        Install This Mod
      </Button>
    </View>
  )
}

export default connect(
  state => ({
    id: state.get('view').get('id'),
    globalInstalled: state.get('settings').get('globalInstalled'),
    krInstalled: state.get('settings').get('krInstalled')
  }),
  dispatch => ({
    goBack: (name, id) => dispatch(goBack())
  })
)(Live2D)