import React from 'react'
import {connect} from 'react-redux'
import {View, ScrollView, Dimensions} from 'react-native'
import {Title, Button, Text} from 'react-native-paper'
import {WebView} from 'react-native-webview'
import openUrl from '../lib/open-url.js'
import installMod from '../lib/install-mod.js'
import BreadCrumbs from './shared/breadcrumbs'

const Live2D = props => {
  const {id, pckName, child} = props,
        variantId = id.replace(/-.+$/, ''),
        newIssueTitle = encodeURIComponent(child.get('name') + ' mod issue for ' + id),
        newIssueBody = encodeURIComponent(
          `[enter details about the issue with ${child.get('name')} here]\n\n` +
          `Leave this Mod ID here: ${id}\n\n` +
          `Leave this link here: https://lokicoder.github.io/destiny-child-tools/childs/${child.get('id')}/`),
        width = Dimensions.get('window').width * 1.25
  return (
    <ScrollView padding={20}>
      <BreadCrumbs>
        <BreadCrumbs.Crumb view="Childs">
          Childs
        </BreadCrumbs.Crumb>
        <BreadCrumbs.Crumb view="Child" id={child.get('id')}>
          {child.get('name')}
        </BreadCrumbs.Crumb>
        <BreadCrumbs.Crumb view="Variant" id={variantId}>{variantId}</BreadCrumbs.Crumb>
        <BreadCrumbs.Crumb>Mod</BreadCrumbs.Crumb>
      </BreadCrumbs>
      <View style={{height: width, width, position: 'relative', left:  Dimensions.get('window').width/8*-1 }}>
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