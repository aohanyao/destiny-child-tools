import React, {useState} from 'react'
import {StyleSheet, Text, ScrollView, View, StatusBar, WebView} from 'react-native'
import {Toolbar} from 'react-native-material-ui'

const stringify = mod =>
  mod.child + '_' +
  mod.variant + '-' +
  mod.modder.toLowerCase().replace(/\s/g, '_') + '-' +
  mod.name.toLowerCase().replace(/\s/g, '_')


export default function App() {
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
    <View style={styles.container}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent />
      <View style={{ backgroundColor: '#000', height: 28 }} />
      <Toolbar
        leftElement="menu"
        centerElement="DC Tools &amp; Mods"
        searchable={{
          autoFocus: true,
          placeholder: 'Search',
        }}
        rightElement={{
          menu: {
            icon: "more-vert",
            labels: ["item 1", "item 2"]
          }
        }}
        onRightElementPress={ (label) => { console.log(label) }}
      />
      <ScrollView>
        {mods && childs && Object.keys(childs[id].variants).map(vId => (
          <View style={{height: 400}} key={vId}>
            <WebView
              originWhitelist={['*']}
              source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/viewer.html?mN=${id}_${vId}&size=500` }}/>
          </View>
        ))}
        {mods && childs && mods.reduce((acc, mod) => { 
          if(mod.child == id) acc.push(mod)
          return acc
        }, []).map(mod => (
          <View style={{height: 400}} key={mod.modder + mod.variant + mod.name}>
            <WebView
              originWhitelist={['*']}
              source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/viewer.html?mN=${stringify(mod)}&size=1000` }}/>
          </View>
        ))}
      </ScrollView>
      {/* {childs && Object.keys(childs).map(id => (
        <Text key={id}>
          {id} {childs[id].name}
        </Text>
      ))} */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})
