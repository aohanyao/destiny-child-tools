import {Linking} from 'react-native'

export default url => Linking.canOpenURL(url).then(supported => {
  if(supported) Linking.openURL(url)
  else alert('Unable to open URL:\n\n' + url)
})