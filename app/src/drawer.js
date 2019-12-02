import React from 'react'
import {connect} from 'react-redux'
import {View, Dimensions, TouchableOpacity, ScrollView} from 'react-native'
import {Drawer, Title, Subheading} from 'react-native-paper'
import Image from 'react-native-scalable-image'
import {setView, setDrawerOpen} from './actions/view.js'
import packageJSON from '../package.json'
import openUrl from './lib/open-url.js'

const Index = ({childs, view, goBack, setView, drawerOpen, setDrawerOpen}) => {
  const DrawerItem = ({label, icon, view}) =>
    <Drawer.Item 
      label={label} 
      icon={icon} 
      onPress={() => { setView(view); setDrawerOpen(false) }} />
  
  return (
    <>
      {drawerOpen && 
        <>
          <TouchableOpacity onPress={() => setDrawerOpen(false)}
              style={{
                backgroundColor: '#000',
                opacity: .5,
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                flexDirection: 'row',
                position: 'absolute',
                top: 0,
                left: 0,
                justifyContent: 'space-between',
                zIndex: 2
              }}>

          </TouchableOpacity>
          <View 
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 1,
              shadowRadius: 10,
              elevation: 10,
              backgroundColor: '#444', 
              height: Dimensions.get('window').height,
              width: 310,
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 3
            }}>
            <View style={{backgroundColor: 'gold'}}>
              <View style={{display: 'flex', flexDirection:'row', flexGrow: 1, paddingLeft: 10, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
                <Image
                  onPress={() => setDrawerOpen(false)}
                  height={78} // height will be calculated automatically
                  style={{marginRight: 10}}
                  source={require('../android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png')} />
                  <View style={{paddingTop: 10}}>
                    <Title style={{color: 'black'}}>DC Mods Manager</Title>
                    <Subheading style={{color: 'black'}}>v{packageJSON.version} by Loki</Subheading>
                  </View>
              </View>
            </View>
            <ScrollView>
              <DrawerItem label="Characters" icon="account-search" view="Childs" />
              <DrawerItem label="Mods" icon="puzzle" view="Mods" />
              <DrawerItem label="Mod Lists" icon="account-group" view="ModLists" />
              <DrawerItem label="Settings" icon="settings" view="Settings" />
              <Drawer.Section title="Project Resources">
                <Drawer.Item label="Release notes" icon="note-text" onPress={() => openUrl('https://github.com/LokiCoder/destiny-child-tools/releases')} />
                <Drawer.Item label="Issues &amp; Suggestions" icon="bug" onPress={() => openUrl('https://github.com/LokiCoder/destiny-child-tools/issues')} />
                <Drawer.Item label="Project on GitHub" icon="github-circle" onPress={() => openUrl('https://github.com/LokiCoder/destiny-child-tools')} />
              </Drawer.Section>
            </ScrollView>
          </View>
        </>
      }
    </>
  )
}

export default connect(
  state => ({
    view: state.get('view'),
    drawerOpen: state.get('view').get('drawerOpen')
  }),
  {setView, setDrawerOpen}
)(Index)