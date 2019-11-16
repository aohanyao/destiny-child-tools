import React from 'react'
import {connect} from 'react-redux'
import {
  ScrollView,
  View,
  Button,
  Image,
  Text
} from 'react-native'
import {goBack} from './actions/view.js'

const Live2D = ({id, goBack}) => {
  return (
    <>
      <Button
        title={"Back"}
        onPress={() => goBack('Childs')} />
      <Text>{id}</Text>
      <WebView
        source={{uri: 'https://github.com/facebook/react-native'}}
        style={{marginTop: 20}}
      />
    </>
  )
}

export default connect(
  state => ({
    id: state.get('view').get('id')
  }),
  dispatch => ({
    goBack: (name, id) => dispatch(goBack())
  })
)(Live2D)