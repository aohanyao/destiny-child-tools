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
import {WebView} from 'react-native-webview'

const Live2D = ({id, goBack}) => {
  return (
    <>
      <Button
        title={"Back"}
        onPress={() => goBack('Childs')} />
      <Text>{id}</Text>
      <WebView
        source={{uri: `https://lokicoder.github.io/destiny-child-tools/live2d/viewer.html?mN=${id}&size=1000&background=%23424242`}}
        height={900}
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