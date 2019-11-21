import React from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Picker
} from 'react-native'
import {IconButton, Card, Text, Title, Button} from 'react-native-paper'
import Image from 'react-native-scalable-image'
import {setChildView} from './actions/child-view.js'
import defaultVariant from './lib/default-variant.js'
import ModCard from './mod-card.js'
import stringifyMod from './lib/stringify-mod.js'

const ToggleButton = ({children, on, onPress}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap:'wrap', marginBottom: 10}}>
      <Button 
        color="#aaa"
        icon={on ? 'eye' : 'eye-off'}
        mode={on ? 'contained' : 'outlined'}
        onPress={onPress}>
        {children}
      </Button>
    </View>
  )
}

const Child = ({child, original, nsfw, sfw, mods, setChildView, sort, order}) => {
  const id = child.get('id'),
        modCards = []
  mods = mods.sortBy(mod => sort == 'variant' 
    ? mod.get('variant') + mod.get('author')
    : mod.get(sort)
  )
  if(order == 'desc') mods = mods.reverse()
  if(original) {
    modCards.concat(child.get('variants').sortBy((_, vId) => vId).toArray().forEach(([vId, variant]) => {
      const pck = `${id}_${vId}`
      modCards.push(<ModCard pck={pck} key={pck} />)
    }))
  }
  mods.forEach(mod => {
    if((nsfw && mod.get('nsfw')) || (sfw && !mod.get('nsfw'))) {
      modCards.push(<ModCard mod={mod} key={stringifyMod(mod)} />)
    }
  })
  // TODO: add pagination of modCards?
  return (
    <View zIndex={1}>
      <ScrollView padding={20}>
        <Card>
          <Card.Content style={{flexDirection: 'row', flexWrap:'wrap'}}>
            <Image
              height={200} // height will be calculated automatically
              style={{marginRight: 20}}
              source={{uri: `https://lokicoder.github.io/destiny-child-tools/img/childs/portraits/${id}_${defaultVariant(child)}.png`}} />
            <View>
              <Title>{child.get('name')}</Title>
              <Text></Text>
              <ToggleButton on={original} onPress={() => setChildView('original', !original)}>
                Original ({child.get('variants').count()}){'    '}
              </ToggleButton>
              <ToggleButton on={sfw} onPress={() => setChildView('sfw', !sfw)}>
                SFW-ish ({child.get('numMods') - child.get('numModsNSFW')}){'      '}
              </ToggleButton>
              <ToggleButton on={nsfw} onPress={() => setChildView('nsfw', !nsfw)}>
                NSFW Mods ({child.get('numModsNSFW')})
              </ToggleButton>
            </View>
          </Card.Content>
        </Card>
        <View style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-end', flexGrow: 1}}>
          <Picker
            selectedValue={sort}
            style={{color: 'white', minWidth: 180}}
            onValueChange={value => {
              setChildView('sort', value)
              if(value.match(/(added)/)) setChildView('order', 'desc')
              else setChildView('order', 'asc')
            }}>
            <Picker.Item label="Variant, Author" value="variant" />
            <Picker.Item label="Date added" value="added" />
          </Picker>
          <IconButton
            icon={`sort-${order == 'desc' ? 'de' : 'a'}scending`} 
            onPress={() => setChildView('order', order == 'desc' ? 'asc' : 'desc')} />
        </View>
        {modCards}
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
      original: state.get('childView').get('original'),
      nsfw: state.get('childView').get('nsfw'),
      sfw: state.get('childView').get('sfw'),
      sort: state.get('childView').get('sort'),
      order: state.get('childView').get('order'),
      mods: state.get('data').get('mods').filter(mod => mod.get('child') == child.get('id'))
    }
  },
  {setChildView}
)(Child)
