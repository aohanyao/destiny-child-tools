import React from 'react'
import {connect} from 'react-redux'
import {ScrollView} from 'react-native'
import {Title, Text} from 'react-native-paper'

const Settings = ({globalInstalled, krInstalled}) => {
  return (
    <ScrollView padding={20}>
      <Title>Settings</Title>
      <Text>Coming soon</Text>
      <Text></Text>
      <Text>Global: {globalInstalled ? 'NOT' : ''} installed</Text>
      <Text>KR: {krInstalled ? 'NOT' : ''} installed</Text>
    </ScrollView>
  )
}

export default connect(
  state => ({
    globalInstalled: state.get('settings').get('globalInstalled'),
    krInstalled: state.get('settings').get('krInstalled')
  })
)(Settings)

