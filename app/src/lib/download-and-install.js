// import ReactNativeAPK from 'react-native-apk'
import openUrl from './open-url.js'

export default version => {
  // const url = `https://github.com/LokiCoder/destiny-child-tools/releases/download/v${latestVersion}/dc-mods-v${latestVersion}.apk`
  const url = `https://github.com/LokiCoder/destiny-child-tools/releases/tag/v` + latestVersion
  openUrl(url)
}