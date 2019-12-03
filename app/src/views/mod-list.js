import React from 'react'
import {connect} from 'react-redux'
import {ScrollView, View, Alert} from 'react-native'
import {Text, Button} from 'react-native-paper'
import ModCard from '../mod-card'
import {installList} from '../actions/mod-lists'
import BreadCrumbs from './shared/breadcrumbs'

const ModList = ({list = [], id, installList}) => {
  return (
    <ScrollView style={{padding: 20, display: 'flex', marginBottom: 58}}>
      <BreadCrumbs>
        <BreadCrumbs.Crumb view="ModLists">
          Mod Lists
        </BreadCrumbs.Crumb>
        <BreadCrumbs.Crumb>{id}</BreadCrumbs.Crumb>
      </BreadCrumbs>
      <Button
        style={{marginBottom: 20}}
        mode="contained"
        onPress={() => {
          Alert.alert(
            'Install List?',
            'Do you want to install all ' + list.length + 
            ' mods in this list? This may take a while.',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Install', onPress: () => installList(id)}
            ]
          )
        }}>
        {id == 'Installed' ? 'Re-' : ''}Install Mod List
      </Button>
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
  },
  {installList}
)(ModList)