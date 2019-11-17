import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Appbar, Button} from 'react-native-paper'
import Childs from './childs.js'
import Child from './child.js'
import Live2D from './live2d.js'
import Search from './search.js'
import {goBack, setView} from './actions/view.js'

const views = {
  Childs,
  Child,
  Live2D,
  Search
}

const Index = ({childs, view, goBack, setView}) => {
  const [query, setQuery] = useState(''),
        PageView = views[view.get('name')],
        data = childs.map(child => child.get('name')),
        viewName = view.get('name')
  return (
    <>
      <Appbar.Header>
        {viewName != 'Childs' && <Appbar.BackAction onPress={goBack} />}
        <Appbar.Content title="DC Toold & Mods"/>
        {viewName !== 'Search' && <Appbar.Action icon="account-search" onPress={() => setView('Search')} />}
      </Appbar.Header>
      <PageView />
    </>
  )
}

export default connect(
  state => ({
    state,
    view: state.get('view'),
    childs: state.get('data').get('childs')
  }),
  {goBack, setView}
)(Index)