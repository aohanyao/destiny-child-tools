import RNFS from 'react-native-fs'
import {fromJS} from 'immutable'
import {combineReducers} from 'redux-immutable'
import {createStore} from 'redux'
import view from './reducers/view.js'
import settings from './reducers/settings.js'
import {BackHandler} from 'react-native'
import data from './reducers/data.js'
import {setChilds, setMods} from './actions/data.js'
import {history} from './reducers/view.js'
import {goBack} from './actions/view.js'
import {setSetting} from './actions/settings.js'
import {globalPath, krPath} from './lib/paths.js'
import {getStoragePermission} from './lib/permissions.js'

const store = createStore(combineReducers({
  data,
  view,
  settings
}))

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

  getStoragePermission().then(() => {
    RNFS.readDir(globalPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(() => store.dispatch(setSetting('globalInstalled', true)))
      .catch(() => store.dispatch(setSetting('globalInstalled', false)))
    RNFS.readDir(krPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(() => store.dispatch(setSetting('krInstalled', true)))
      .catch(() => store.dispatch(setSetting('krInstalled', false)))
  })

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