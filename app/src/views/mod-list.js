import React from 'react'
import {connect} from 'react-redux'
import {ScrollView, View} from 'react-native'
import {Text, Button} from 'react-native-paper'
import ModCard from '../mod-card'
import BreadCrumbs from './shared/breadcrumbs'

const ModList = ({list = [], id}) => {
  console.log('list', list)
  return (
    <ScrollView style={{padding: 20, display: 'flex', marginBottom: 58}}>
      <BreadCrumbs>
        <BreadCrumbs.Crumb view="ModLists">
          Mod Lists
        </BreadCrumbs.Crumb>
        <BreadCrumbs.Crumb>{id}</BreadCrumbs.Crumb>
      </BreadCrumbs>
      {list.map(modKey => <ModCard mod={modKey} key={modKey} />)}
      <Text>List features like restore all, export, share, etc. coming soon(ish) ...</Text>
      <Text></Text>
      <Text></Text>
    </ScrollView>
  )
}

export default connect(
  state => {
    const id = state.get('view').get('id')
    return {
      id,
      list: state.get('data').get('modLists')[id]
    }
  }
)(ModList)