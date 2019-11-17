import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Title} from 'react-native-paper'
import {Button, View, TouchableOpacity, Keyboard} from 'react-native'
import Childs from './childs.js'
import Child from './child.js'
import Live2D from './live2d.js'
import Autocomplete from 'react-native-autocomplete-input'
import {setView} from './actions/view.js'

const views = {
  Childs,
  Child,
  Live2D
}

const Index = ({childs, setView}) => {
  const [query, setQuery] = useState(''),
        data = query 
          ? childs
            .filter(c => (c.get('name') + c.get('id')).match(query))
            .sortBy(c => c.get('id'))
            .map(c => c.get('name'))
            .toArray()
          : []
  return (
    <>
      <View style={{width: '100%'}} zIndex={999} position="absolute" top={80} paddingLeft={20} paddingRight={20}>
        <Title>Search by name or ID</Title>
        <Autocomplete
          data={data}
          defaultValue={query}
          onChangeText={text => setQuery(text)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item, i }) => (
            <TouchableOpacity key={item[0]}>
              <Button
                title={item[0] + ' - ' + item[1]}
                onPress={e => {
                  setQuery('')
                  Keyboard.dismiss()
                  setView('Child', item[0])
                }} />
            </TouchableOpacity>
          )}/>
      </View>
      <View style={{height: 60}}></View>
    </>
  )
}

export default connect(
  state => ({
    childs: state.get('data').get('childs')
  }),
  {setView}
)(Index)