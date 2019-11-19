import React from 'react'
import {connect} from 'react-redux'
import {ScrollView, View, Linking} from 'react-native'
import {Title, Text, Button} from 'react-native-paper'
import {clientPaths} from './lib/paths.js'
import packageJSON from '../package.json'
import theme from './theme.js'

const openUrl = url => Linking.canOpenURL(url).then(supported => {
  if(supported) Linking.openURL(url)
  else alert('Unable to open URL:\n\n' + url)
})

const downloadLatest = (latestVersion) => {
  const url = `https://github.com/LokiCoder/destiny-child-tools/releases/tag/v` + latestVersion
  openUrl(url)
}

const LinkButton = ({icon, children, url, mode = 'outlined', onPress, color = theme.colors.text}) => (
  <View style={{marginTop: 20}}>
    <Button icon={icon} mode={mode} color={color} onPress={() => onPress && onPress() || openUrl(url)}>
      {children}
    </Button>
  </View>
)

const Settings = props => {
  const {latestVersion} = props,
        hasLatestVersion = packageJSON.version == latestVersion
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
      <Text>App Version: v{packageJSON.version} {hasLatestVersion && '(latest)'}</Text>
      <Text></Text>
      {!hasLatestVersion && 
        <LinkButton icon="download" mode="contained" onPress={() => downloadLatest(latestVersion)} color={theme.colors.primary}>
          Download Latest (v{latestVersion})
        </LinkButton>
      }
      <LinkButton icon="bug" url={'https://github.com/LokiCoder/destiny-child-tools/issues'}>
        Open Issues
      </LinkButton>
      <LinkButton icon="note-text" url={'https://github.com/LokiCoder/destiny-child-tools/releases'}>
        Release Notes
      </LinkButton>
      <LinkButton icon="github-circle" url={'https://github.com/LokiCoder/destiny-child-tools'}>
        Source Code on GitHub
      </LinkButton>
    </ScrollView>
  )
}

export default connect(
  state => {
    const props = {
      latestVersion: state.get('settings').get('latestVersion')
    }
    Object.keys(clientPaths).forEach(client => {
      props[client + 'Path'] = state.get('settings').get(client + 'Path')
    })
    return props
  }
)(Settings)

