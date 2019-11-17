
import {Map} from 'immutable'
import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Title, Chip, TextInput} from 'react-native-paper'
import {View, ScrollView, TouchableOpacity} from 'react-native'
import Childs from './childs.js'
import Child from './child.js'
import Live2D from './live2d.js'
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
          : Map()
  return (
    <>
      <View style={{width: '100%'}} padding={20}>
        <Title>Search by name or ID</Title>
        <TextInput
          onChangeText={text => setQuery(text)}
          type="flat" />
         <ScrollView>
          {data.take(20).toArray().map(([id, child], i) => {
            return (
              <View key={id} marginTop={20}>
                <TouchableOpacity onPress={() => setView('Child', id)}>
                  <Chip padding={20}>
                    {id} - {child.get('name')}
                  </Chip>
                </TouchableOpacity>
              </View>
            );
          })}
          </ScrollView>
      </View>
    </>
  )
}

export default connect(
  state => ({
    childs: state.get('data').get('childs')
  }),
  {setView}
)(Index)