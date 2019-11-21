import React from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Picker
} from 'react-native'
import {IconButton, Card, Text, Title, Button} from 'react-native-paper'
import Image from 'react-native-scalable-image'
import {setChildView} from '../actions/child-view.js'
import defaultVariant from '../lib/default-variant.js'
import ModCard from '../mod-card.js'
import stringifyMod from '../lib/stringify-mod.js'
import isSwap from '../lib/is-swap.js'
import ModTypePicker from './shared/mod-type-picker.js'
import ModSort from './shared/mod-sort.js'

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

const Child = ({child, original, type, nsfw, sfw, mods, setChildView, sort, order, variant}) => {
  const id = child.get('id'),
        modCards = []
  if(variant) mods = mods.filter(m => m.get('variant') == variant)
  if(type != 'all') {
    mods = mods.filter(m => type == 'swaps' ? isSwap(m) : !isSwap(m))
  }
  mods = mods.sortBy(mod => sort == 'variant' 
    ? mod.get('variant') + mod.get('author')
    : mod.get(sort)
  )
  if(order == 'desc') mods = mods.reverse()
  if(original) {
    modCards.concat(child.get('variants').sortBy((_, vId) => vId).toArray().forEach(([vId]) => {
      if(!variant || vId == variant) {
        const pck = `${id}_${vId}`
        modCards.push(<ModCard pck={pck} key={pck} />)
      }
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
          <Card.Title title={child.get('name')} />
          <Card.Content style={{flexDirection: 'row', flexWrap:'wrap'}}>
            <Image
              height={200} // height will be calculated automatically
              style={{marginRight: 20}}
              source={{uri: `https://lokicoder.github.io/destiny-child-tools/img/childs/portraits/${id}_${defaultVariant(child)}.png`}} />
            <View>
              <ToggleButton on={original} onPress={() => setChildView('original', !original)}>
                Original ({child.get('variants').count()}){'    '}
              </ToggleButton>
              <ToggleButton on={sfw} onPress={() => setChildView('sfw', !sfw)}>
                SFW-ish ({child.get('numMods') - child.get('numModsNSFW')}){'      '}
              </ToggleButton>
              <ToggleButton on={nsfw} onPress={() => setChildView('nsfw', !nsfw)}>
                NSFW Mods ({child.get('numModsNSFW')})
              </ToggleButton>
              <ModTypePicker />
            </View>
          </Card.Content>
        </Card>
        <View style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-end', flexGrow: 1}}>
          <Picker
            selectedValue={variant}
            style={{color: 'white', minWidth: 100}}
            onValueChange={value => setChildView('variant', value)}>
            <Picker.Item label="All" value={false} />
            {Object.keys(child.get('variants').toJS()).sort().map(variant =>
              <Picker.Item label={variant} value={variant} />
            )}
          </Picker>
          <ModSort />
        </View>
        {modCards.length > 0
          ? modCards
          : <View style={{justifyContent: 'center', marginTop: 60}}>
            <Text style={{textAlign: 'center'}}>Noting found matching your filters.</Text>
            <Text></Text>
            <Button 
              mode="contained" 
              icon="nuke"
              onPress={() => {{
                setChildView('original', true)
                setChildView('nsfw', true)
                setChildView('sfw', true)
                setChildView('swaps', 'all')
                setChildView('variant', false)
              }}}>
              Clear All Filters
            </Button>
          </View>
        }
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
      type: state.get('childView').get('type'),
      nsfw: state.get('childView').get('nsfw'),
      sfw: state.get('childView').get('sfw'),
      sort: state.get('childView').get('sort'),
      order: state.get('childView').get('order'),
      variant: state.get('childView').get('variant'),
      mods: state.get('data').get('mods').filter(mod => mod.get('child') == child.get('id'))
    }
  },
  {setChildView}
)(Child)
