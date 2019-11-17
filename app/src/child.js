import React from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Button
} from 'react-native'
import { Dimensions } from 'react-native'
import {Title, Text} from 'react-native-paper'
import Image from 'react-native-scalable-image'
import {setView, goBack} from './actions/view.js'

const stringify = mod =>
  mod.get('child') + '_' +
  mod.get('variant') + '-' +
  mod.get('modder').toLowerCase().replace(/\s/g, '_') + '-' +
  mod.get('name').toLowerCase().replace(/\s/g, '_')

const Child = ({child, setView, goBack, mods}) => {
  const id = child.get('id')
  return (
    <View zIndex={1}>
      <ScrollView padding={20}>
        <Title>{child.get('name')}</Title>
        <Image
          height={200} // height will be calculated automatically
          source={{uri: `https://lokicoder.github.io/destiny-child-tools/img/childs/portraits/${id}_01.png`}} />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
          }}>
            {child.get('variants').sortBy((_, vId) => vId).toArray().map(([vId, variant]) => {
              const key = `${id}_${vId}`
              return (
                <View paddingTop={20}>
                  <Image
                    key={key}
                    onPress={() => setView('Live2D', key)}
                    height={Dimensions.get('window').height * .6}
                    width={Dimensions.get('window').width * .6}
                    source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${key}/preview-424242.png`}} />
                </View>
              )
            })}
            {mods.sortBy(mod => mod.get('variant') + mod.get('modder')).toArray().map(mod => {
              const key = stringify(mod)
              return (
                <View paddingTop={20} key={key}>
                  <Text>{key}</Text>
                  <Image
                    key={key}
                    onPress={() => setView('Live2D', key)}
                    height={Dimensions.get('window').height * .6}
                    width={Dimensions.get('window').width * .6}
                    source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${key}/preview-424242.png`}} />
                </View>
              )
            })}
          </View>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
          <Text></Text>
      </ScrollView>
    </View>
  )
}

export default connect(
  state => {
    const child = state.get('data').get('childs').get(state.get('view').get('id'))
    return {
      child,
      mods: state.get('data').get('mods').filter(mod => mod.get('child') == child.get('id'))
    }
  },
  dispatch => ({
    setView: (name, id) => dispatch(setView(name, id)),
    goBack: () => dispatch(goBack())
  })
)(Child)
