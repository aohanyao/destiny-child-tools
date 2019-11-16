import React from 'react'
import {connect} from 'react-redux'
import {Text} from 'react-native'
import Childs from './childs.js'
import Child from './child.js'
import Live2D from './live2d.js'

const views = {
  Childs,
  Child,
  Live2D
}

const Index = ({view, state}) => {
  const View = views[view.get('name')]
  return <View />
}

export default connect(
  state => ({
    state,
    view: state.get('view')
  })
)(Index)