import React from 'react'
import {connect} from 'react-redux'
import {ScrollView} from 'react-native'
import {Title, Text} from 'react-native-paper'

const Settings = () => {
  return (
    <ScrollView padding={20}>
      <Title>Settings</Title>
      <Text>Coming soon</Text>
    </ScrollView>
  )
}

export default connect()(Settings)

