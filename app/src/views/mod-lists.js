import React from 'react'
import {connect} from 'react-redux'
import {ScrollView, View} from 'react-native'
import {Text, Title, Button} from 'react-native-paper'
import {setView} from '../actions/view'

const ModLists = ({lists = {}, setView}) => {
  return (
    <ScrollView style={{margin: 20, display: 'flex', marginBottom: 40}}>
      <Title>Mod Lists</Title>
      {Object.keys(lists).map(listName =>
        <View key={listName} style={{marginTop: 10, marginBottom: 10}}>
          <Button 
            color="white" 
            mode="contained"
            onPress={() => setView('ModList', listName)}>
            {listName} ({lists[listName].length})
          </Button>
        </View>
      )}
      <Text></Text>
      <Text>Custom mod lists coming soon(ish) ...</Text>
    </ScrollView>
  )
}

export default connect(
  state => ({
    lists: state.get('data').get('modLists')
  }),
  {setView}
)(ModLists)