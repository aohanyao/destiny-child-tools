import {Alert} from 'react-native'
import {combineReducers} from 'redux-immutable'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import view from './reducers/view.js'
import settings from './reducers/settings.js'
import childView from './reducers/child-view.js'
import modsView from './reducers/mods-view.js'
import {BackHandler} from 'react-native'
import data from './reducers/data.js'
import {fetchData} from './actions/data.js'
import {history} from './reducers/view.js'
import {goBack} from './actions/view.js'
import {setSetting} from './actions/settings.js'
import openUrl from './lib/open-url.js'
import packageJSON from '../package.json'
import downloadAndInstall from './lib/download-and-install.js'
import {detectInstalledClients} from './actions/data'

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

store.dispatch(fetchData('childs'))
store.dispatch(fetchData('mods'))
store.dispatch(fetchData('model_info.global', false))
store.dispatch(fetchData('model_info.kr', false))
store.dispatch(detectInstalledClients())

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