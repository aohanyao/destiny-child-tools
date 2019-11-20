import React from 'react'
import {connect} from 'react-redux'
import {View, ScrollView} from 'react-native'
import {getStoragePermission} from './lib/permissions.js'
import {Title, Button, Text} from 'react-native-paper'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {clientPaths} from './lib/paths.js'
import {WebView} from 'react-native-webview'
import openUrl from './lib/open-url.js'

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
  })
}

const Live2D = props => {
  const {id, pckName, child} = props,
        matches = id.match(/[a-z]{1,2}\d{3}_\d{2}/),
        newIssueTitle = encodeURIComponent(child.get('name') + ' mod issue for ' + id),
        newIssueBody = encodeURIComponent(
          `[enter details about the issue with ${child.get('name')} here]\n\n` +
          `Leave this Mod ID here: ${id}\n\n` +
          `Leave this link here: http://localhost:3000/destiny-child-tools/childs/${child.get('id')}/`)
  return (
    <ScrollView padding={20}>
      <Title>{id}</Title>
      <View height={400}>
        <WebView
          source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/viewer.html?mN=${id}&size=2000&background=%23424242`}}
          automaticallyAdjustContentInsets={false}
        />
      </View>
      <Button
        mode="contained"
        icon="cloud-download"
        onPress={() => installMod(Object.assign({}, props, {pckName})) } >
        {pckName == id ? 'Restore' : 'Install This Mod'}
      </Button>
      <View style={{marginTop: 20, paddingBottom: 10}}>
        <Button icon="bug" mode="outlined" color='white' onPress={() => openUrl(`https://github.com/LokiCoder/destiny-child-tools/issues/new?title=${newIssueTitle}&body=${newIssueBody}`)}>
          Report Issue with this Mod
        </Button>
      </View>
      <Text style={{color: '#aaa', textAlign: 'center'}}>(requires a GitHub account)</Text>
    </ScrollView>
  )
}

export default connect(
  state => {
    const id = state.get('view').get('id'),
          matches = id.match(/([a-z]{1,2}\d{3})_\d{2}/)
    const props = {
      id,
      pckName: matches[0],
      child: state.get('data').get('childs').get(matches[1])
    }
    Object.keys(clientPaths).forEach(client => {
      props[client + 'Path'] = state.get('settings').get(client + 'Path')
    })
    return props
  }
)(Live2D)