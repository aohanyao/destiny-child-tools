import React from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Button,
  Text
} from 'react-native'
import { Dimensions } from 'react-native'
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
    <>
      <Button
        title={"Back"}
        onPress={() => setView('Childs')} />
      <ScrollView>
        <Image
          height={400} // height will be calculated automatically
          source={{uri: `https://lokicoder.github.io/destiny-child-tools/img/childs/portraits/${id}_01.png`}} />
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
          }}>
            {child.get('variants').sortBy((_, vId) => vId).toArray().map(([vId, variant]) => {
              const key = `${id}_${vId}`
              return (
                <Image
                  key={key}
                  onPress={() => setView('Live2D', key)}
                  height={Dimensions.get('window').height * .8}
                  width={Dimensions.get('window').width * .8}
                  source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${key}/preview-424242.png`}} />
              )
            })}
            {mods.sortBy(mod => mod.get('variant') + mod.get('modder')).toArray().map(mod => (
              <Image
                key={stringify(mod)}
                height={Dimensions.get('window').height * .8}
                width={Dimensions.get('window').width * .8}
                source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${stringify(mod)}/preview-424242.png`}} />
            ))}
          </View>
      </ScrollView>
    </>
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
    goBack
  })
)(Child)


{/* <ScrollView>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
          }}>
            {childs && Object.keys(childs[id].variants).map(vId => (
              <ScaledImage
                key={`${id}_${vId}`}
                height={Dimensions.get('window').height * .9}
                uri={`https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}_${vId}/preview-424242.png`}
              />
            ))}
            {mods && mods.reduce((acc, mod) => { 
              if(mod.child == id) acc.push(mod)
              return acc
            }, []).map(mod => (
              <ScaledImage
                key={`${stringify(mod)}}}`}
                height={Dimensions.get('window').height * .9}
                uri={`https://lokicoder.github.io/destiny-child-tools/live2d/assets/${stringify(mod)}/preview-424242.png`}
              />
            ))}
          </View>
      </ScrollView> */}