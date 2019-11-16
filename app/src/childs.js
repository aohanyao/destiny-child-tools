import React from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Button,
  Image,
  Alert
} from 'react-native'
import {setView} from './actions/view.js'

const Childs = ({childs, setView}) => {
  return (
    <>
      <ScrollView>
      {
        childs.sortBy(child => child.get('id')).take(20).toArray().map(([id, child], i) => {
          return (
            <View key={id}>
              <Button
                title={`${child.get('name')} - ${id}`}
                onPress={() => setView('Child', id)} />
            </View>
          );
        })
      }
      </ScrollView>
    </>
  )
}

export default connect(
  state => ({
    childs: state.get('data').get('childs')
  }),
  dispatch => ({
    setView: (name, id) => dispatch(setView(name, id))
  })
)(Childs)