/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState}  from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native'
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen'
import ScaledImage from './scaled-image'

const stringify = mod =>
  mod.child + '_' +
  mod.variant + '-' +
  mod.modder.toLowerCase().replace(/\s/g, '_') + '-' +
  mod.name.toLowerCase().replace(/\s/g, '_')


const App: () => React$Node = () => {
  const [childs, setData] = useState(),
        [mods, setMods] = useState()
  if(!childs) {
    fetch('https://lokicoder.github.io/destiny-child-tools/data/childs.json')
      .then((response) => response.json())
      .then((childs) => {
        setData(childs)
      })
      .catch((error) => {
        alert(error)
      })
  }
  if(!mods) {
    fetch('https://lokicoder.github.io/destiny-child-tools/data/mods.json')
      .then((response) => response.json())
      .then((mods) => {
        setMods(mods)
      })
      .catch((error) => {
        alert(error)
      })
  }
  const id = 'c202'
  return (
    <View style={{flex: 1, backgroundColor: '#424242'}}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        {mods && childs && Object.keys(childs[id].variants).map(vId => (
          <ScaledImage
            key={`${id}_${vId}`}
            uri={`https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}_${vId}/preview-424242.png`}
          />
        ))}
        {mods && childs && mods.reduce((acc, mod) => { 
          if(mod.child == id) acc.push(mod)
          return acc
        }, []).map(mod => (
          <ScaledImage
            key={`${stringify(mod)}}}`}
            uri={`https://lokicoder.github.io/destiny-child-tools/live2d/assets/${stringify(mod)}/preview-424242.png`}
          />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
})

export default App
