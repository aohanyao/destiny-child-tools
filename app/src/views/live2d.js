import React from 'react'
import {connect} from 'react-redux'
import {View, ScrollView} from 'react-native'
import {Title, Button, Text} from 'react-native-paper'
import {WebView} from 'react-native-webview'
import openUrl from '../lib/open-url.js'
import installMod from '../lib/install-mod.js'

const Live2D = props => {
  const {id, pckName, child} = props,
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
        onPress={() => installMod(id) } >
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
    return props
  }
)(Live2D)