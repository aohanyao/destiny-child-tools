import React from 'react'
import {connect} from 'react-redux'
import {
  Button,
  Text,
  PermissionsAndroid
} from 'react-native'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {goBack} from './actions/view.js'
import {WebView} from 'react-native-webview'

const getStoragePermission = () => new Promise((resolve) => {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then(result => {
    if(result == PermissionsAndroid.RESULTS.GRANTED) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE).then(result => {
        if(result == PermissionsAndroid.RESULTS.GRANTED) {
          resolve()
        }
        else {
          alert('This app needs to be able to write to your external storage to be able to install Destiny Child mods.')
        }
      })
    }
    else {
      alert('This app needs to be able to read your external storage to know what version of Destiny Child you have installed.')
    }
  })
})

const globalPath = '/sdcard/Android/data/com.linegames.dcglobal/files/asset/'

const installMod = (path, pckName) => {
  getStoragePermission().then(() => {
    RNFS.readDir(globalPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        // alert(JSON.stringify(result, null, 2))
        RNFetchBlob
          .config({
            path: globalPath + `character/${pckName}.pck`
          })
          .fetch('GET', path)
        // RNFetchBlob.fetch('GET', 'http://www.example.com/images/img1.png')
          .then((res) => {
            let status = res.info().status;
            
            if(status == 200) alert('Mod installed.\n\nRestart Destiny Child if it\'s running.')
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

const Live2D = ({id, goBack}) => {
  const pckName = id.match(/[a-z]{1,2}\d{3}_\d{2}/)[0]
  return (
    <>
      <Button
        title={"Back"}
        onPress={() => goBack('Childs')} />
      <Text>{id}</Text>
      <WebView
        source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/viewer.html?mN=${id}&size=1000&background=%23424242`}}
        height={900}
      />
      <Button
        title="Install"
        onPress={() => installMod(`https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}/${pckName}.pck`, pckName)} />
    </>
  )
}

export default connect(
  state => ({
    id: state.get('view').get('id')
  }),
  dispatch => ({
    goBack: (name, id) => dispatch(goBack())
  })
)(Live2D)