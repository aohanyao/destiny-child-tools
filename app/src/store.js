import {Alert} from 'react-native'
import RNFS from 'react-native-fs'
import {fromJS} from 'immutable'
import {combineReducers} from 'redux-immutable'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import view from './reducers/view.js'
import settings from './reducers/settings.js'
import childView from './reducers/child-view.js'
import modsView from './reducers/mods-view.js'
import {BackHandler} from 'react-native'
import data from './reducers/data.js'
import {setData, setClientData} from './actions/data.js'
import {history} from './reducers/view.js'
import {goBack} from './actions/view.js'
import {setSetting} from './actions/settings.js'
import {storagePaths, clientPaths} from './lib/paths.js'
import {getStoragePermission} from './lib/permissions.js'
import openUrl from './lib/open-url.js'
import {readModelInfo} from './actions/model-info'
import packageJSON from '../package.json'
import downloadAndInstall from './lib/download-and-install.js'

const clients = Object.keys(clientPaths)

const store = createStore(combineReducers({
  data,
  view,
  settings,
  childView,
  modsView
}), applyMiddleware(thunk))

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

// fetch version
fetch('https://raw.githubusercontent.com/LokiCoder/destiny-child-tools/master/app/package.json')
  .then(response => response.json())
  .then(({version}) => {
    store.dispatch(setSetting('latestVersion', version))
    if(packageJSON.version != version) {
      showDownloadPrompt(version)
    }
  })
  .catch(error => alert(error))

const fetchData = (file, useImmutable = true) =>
  fetch(`https://lokicoder.github.io/destiny-child-tools/data/${file}.json`)
    .then(response => response.json())
    .then(data => store.dispatch(setData(file, useImmutable ? fromJS(data) : data)))
    .catch(alert)

fetchData('childs')
fetchData('mods')
fetchData('model_info.global', false)
fetchData('model_info.kr', false)

let clientIndex = 0,
    storageIndex = 0

const found = {}
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
        store.dispatch(setClientData('installPaths', client, pathToCheck))
        store.dispatch(setSetting(client + 'Path', pathToCheck))
        store.dispatch(readModelInfo(client))
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