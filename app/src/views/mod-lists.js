import React from 'react'
import {connect} from 'react-redux'
import {ScrollView, View} from 'react-native'
import {Text, Title, Button, IconButton} from 'react-native-paper'
import {setView} from '../actions/view'
import {createModList} from '../actions/mod-lists'

const mainLists = ['Installed', 'Favorites']

const ModLists = ({lists = {}, setView, createModList}) => {
  const List = ({listName}) => (
    <View key={listName} style={{marginTop: 10, marginBottom: 10}}>
      <Button 
        color="white" 
        mode="contained"
        onPress={() => setView('ModList', listName)}>
        {listName} ({lists[listName].length})
      </Button>
    </View>
  )
  return (
    <ScrollView style={{margin: 20, display: 'flex', marginBottom: 40}}>
      <View style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between'}}>
        <Title>Mod Lists</Title>
        <IconButton icon="playlist-plus" style={{position: 'relative', top: -5}} onPress={createModList} />
      </View>
      {mainLists.map(listName => <List {...{listName}} />)}
      {Object.keys(lists).sort().map(listName =>  mainLists.indexOf(listName) == -1 ? <List {...{listName}} /> : <></>)}
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
    </ScrollView>
  )
}

export default connect(
  state => ({
    lists: state.get('data').get('modLists')
  }),
  {setView, createModList}
)(ModLists)