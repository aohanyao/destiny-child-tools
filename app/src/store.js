import {Alert} from 'react-native'
import RNFS from 'react-native-fs'
import {fromJS} from 'immutable'
import {combineReducers} from 'redux-immutable'
import {createStore} from 'redux'
import view from './reducers/view.js'
import settings from './reducers/settings.js'
import childView from './reducers/child-view.js'
import modsView from './reducers/mods-view.js'
import {BackHandler} from 'react-native'
import data from './reducers/data.js'
import {setChilds, setMods} from './actions/data.js'
import {history} from './reducers/view.js'
import {goBack} from './actions/view.js'
import {setSetting} from './actions/settings.js'
import {storagePaths, clientPaths, globalPath, krPath} from './lib/paths.js'
import {getStoragePermission} from './lib/permissions.js'
import openUrl from './lib/open-url.js'
import packageJSON from '../package.json'
import downloadAndInstall from './lib/download-and-install.js'

const store = createStore(combineReducers({
  data,
  view,
  settings,
  childView,
  modsView
}))

const showDownloadPrompt = version => Alert.alert(
  'New Version Available', 
  `Would you like to update to ${version} now?`,
  [
    {text: 'View Changelog', onPress: () => {
      showDownloadPrompt(version)
      openUrl(`https://github.com/LokiCoder/destiny-child-tools/releases`)
    }},
    {text: 'Cancel', style: 'cancel'},
    {text: 'OK', onPress: () => downloadAndInstall(version)},
  ],
  {cancelable: false}
)

fetch('https://raw.githubusercontent.com/LokiCoder/destiny-child-tools/master/app/package.json')
  .then(response => response.json())
  .then(({version}) => {
    store.dispatch(setSetting('latestVersion', version))
    if(packageJSON.version != version) {
      showDownloadPrompt(version)
    }
  })
  .catch(error => alert(error))

fetch('https://lokicoder.github.io/destiny-child-tools/data/childs.json')
  .then((response) => response.json())
  .then((childs) => {
    store.dispatch(setChilds(fromJS(childs)))
  })
  .catch((error) => {
    alert(error)
  })

fetch('https://lokicoder.github.io/destiny-child-tools/data/mods.json')
  .then((response) => response.json())
  .then((mods) => {
    store.dispatch(setMods(fromJS(mods)))
  })
  .catch((error) => {
    alert(error)
  })

let clientIndex = 0,
    storageIndex = 0

const found = {},
      clients = Object.keys(clientPaths)
const checkNextClientPath = () => {
  const next = () => {
    storageIndex++
    if(storageIndex == storagePaths.length) {
      storageIndex = 0
      clientIndex++
      if(clientIndex < clients.length) checkNextClientPath()
    }
    else checkNextClientPath()
  }
  const client = clients[clientIndex],
        storagePath = storagePaths[storageIndex],
        pathToCheck = storagePath + clientPaths[client]
  if(!found[client]) {
    RNFS.readDir(pathToCheck) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(() => {
        store.dispatch(setSetting(client + 'Path', pathToCheck))
        found[client] = true
        next()
      })
      .catch(next)
  }
  else next()
}
getStoragePermission().then(checkNextClientPath)


BackHandler.addEventListener('hardwareBackPress', function() {
  // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
  // Typically you would use the navigator here to go to the last state.

  if(history.length > 1) {
    store.dispatch(goBack())
    return true;
  }
  return false;
});
  


export default store