import React, {useState, useRef} from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Picker,
  Dimensions
} from 'react-native'
import Image from 'react-native-scalable-image'
import {setView, setViewChilds} from '../actions/view.js'
import {setChildView} from '../actions/child-view.js'
import {setModsView} from '../actions/mods-view.js'
import {
  Card,
  DataTable,
  Text,
  TextInput,
  IconButton,
  Title
} from 'react-native-paper'
import defaultVariant from '../lib/default-variant.js'
import ModCard from '../mod-card.js'
import stringifyMod from '../lib/stringify-mod.js'
import isSwap from '../lib/is-swap.js'
import ModTypePicker from './shared/mod-type-picker.js'
import ModSort from './shared/mod-sort.js'

const Childs = ({mods, page, setModsView, filter = '', order, sort, type}) => {
  if(!mods.count()) {
    return (
      <View style={{margin: 20}}>
        <Text>Loading ...</Text>
      </View>
    )
  }
  if(type != 'all') {
    mods = mods.filter(m => type == 'swaps' ? isSwap(m) : !isSwap(m))
  }
  if(filter) {
    mods = mods.filter(m => 
      (m.get('name') + m.get('modder') + m.get('child') + '_' + m.get('variant'))
        .toLowerCase().match(filter.toLowerCase())
    )
  }
  mods = mods.sortBy(mod => sort == 'variant' 
    ? mod.get('variant') + mod.get('author')
    : mod.get(sort)
  )
  if(order == 'desc') mods = mods.reverse()
  const numPerPage = 10,
        numberOfPages = Math.ceil(mods.count() / numPerPage),
        scrollViewRef = useRef(null),
        onPageChange = page => {
          scrollViewRef.current.scrollTo({x: 0, y: 0, animated: false})
          setModsView('page', page)
        }
  return (
    <>
      <ScrollView ref={scrollViewRef} style={{background: '#424242', display: 'flex'}} keyboardShouldPersistTaps="handled">
        <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20, paddingBottom: 10}}>
          <TextInput
            label="Filter mods by name, ID, or modder"
            mode="flat"
            value={filter}
            selectionColor="white"
            onChangeText={text => {
              setModsView('filter', text)
              setModsView('page', 0)
            }}
          />
          {Boolean(filter) && 
            <View style={{position: 'absolute', right: 30, top: 30}}>
              <IconButton
                icon="close"
                color="gray"
                onPress={() => {
                  setModsView('filter', '')
                  setModsView('page', 0)
                }}
              />
            </View>
          }
          <View style={{display: 'flex', flexDirection:'row', justifyContent: 'flex-end'}}>
            <ModTypePicker onChange={() => setModsView('page', 0)} />
            <ModSort onChange={() => setModsView('page', 0)} />
          </View>
        </View>
        {numberOfPages > 1 && 
          <DataTable.Pagination {...{
            label: `Page ${page + 1} pf ${numberOfPages}`,
            page,
            numberOfPages,
            onPageChange
          }} />
        }
        <View style={{marginLeft: 20, marginRight: 20}}>
          {mods.slice(page * numPerPage, page * numPerPage + numPerPage).map(mod => 
            <ModCard mod={mod} key={stringifyMod(mod)} />
          )}
        </View>
        {numberOfPages > 1 && 
          <DataTable.Pagination {...{
            label: `Page ${page + 1} pf ${numberOfPages}`,
            page,
            numberOfPages,
            onPageChange
          }} />
        }
      </ScrollView>
    </>
  )
}

export default connect(
  state => ({
    childs: state.get('data').get('childs'),
    mods: state.get('data').get('mods'),
    page: state.get('modsView').get('page'),
    filter: state.get('modsView').get('filter'),
    order: state.get('childView').get('order'),
    sort: state.get('childView').get('sort'),
    type: state.get('childView').get('type')
  }),
  {setView, setViewChilds, setChildView, setModsView}
)(Childs)