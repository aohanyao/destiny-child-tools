import React, {useState} from 'react'
import {connect} from 'react-redux'
import {View, Dimensions, TouchableOpacity, ScrollView} from 'react-native'
import {Appbar, Title, Subheading} from 'react-native-paper'
import Image from 'react-native-scalable-image'
import Childs from './views/childs.js'
import Child from './views/child.js'
import Mods from './views/mods.js'
import Live2D from './views/live2d.js'
import Variant from './views/variant.js'
import Settings from './views/settings.js'
import {goBack, setView, setDrawerOpen} from './actions/view.js'
import packageJSON from '../package.json'
import openUrl from './lib/open-url.js'
import Drawer from './drawer'

const views = {
  Childs,
  Child,
  Live2D,
  Settings,
  Mods,
  Variant
}

const Index = ({childs, view, goBack, setView, drawerOpen, setDrawerOpen}) => {
  const [query, setQuery] = useState(''),
        PageView = views[view.get('name')],
        
        data = childs.map(child => child.get('name')),
        viewName = view.get('name')

  return (
    <View>
      <View style={{zIndex: 1}}>
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => setDrawerOpen(true)} />
          <Appbar.Content title="DC Mods"/>
          <Appbar.Action icon="puzzle" onPress={() => viewName !== 'Mods' && setView('Mods')} />
          <Appbar.Action icon="account-search" onPress={() => viewName !== 'Childs' && setView('Childs')} />
          <Appbar.Action icon="settings" onPress={() => viewName !== 'Settings' && setView('Settings')} />
        </Appbar.Header>
      </View>
      <PageView />
      <Drawer />
    </View>
  )
}

export default connect(
  state => ({
    state,
    view: state.get('view'),
    childs: state.get('data').get('childs'),
    drawerOpen: state.get('view').get('drawerOpen')
  }),
  {goBack, setView, setDrawerOpen}
)(Index)