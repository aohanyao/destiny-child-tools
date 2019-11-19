import React from 'react'
import {connect} from 'react-redux'
import {ScrollView, View} from 'react-native'
import {Title, Text} from 'react-native-paper'
import {clientPaths} from './lib/paths.js'
import packageJSON from '../package.json'

const Settings = props => {
  return (
    <ScrollView padding={20}>
      <Title>Settings</Title>
      <Text>Coming soon</Text>
      <Text></Text>
      <Text>Installed Clients:</Text>
      <Text></Text>
      {Object.keys(clientPaths).map(client => 
        <View key={client}>
          <Text>
            {client}: {props[client + 'Path'] || 'not installed'} 
          </Text>
          <Text></Text>
        </View>
      )}
      <Text></Text>
      <Text>Version {packageJSON.version}</Text>
    </ScrollView>
  )
}

export default connect(
  state => {
    const props = {}
    Object.keys(clientPaths).forEach(client => {
      props[client + 'Path'] = state.get('settings').get(client + 'Path')
    })
    return props
  }
)(Settings)

