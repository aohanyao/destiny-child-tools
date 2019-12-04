import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {Alert} from 'react-native'
import stringifyMod from '../lib/stringify-mod.js'
import getModFromKey from '../lib/get-mod-from-key'
import store from '../store.js'
import deepDiff from 'deep-diff'
import {readModelInfo} from '../actions/model-info'
import {addModToList} from './mod-lists'

export const installMod = (mod, showConfirmation = true, nextAction, globalOnly) =>
  dispatch => {
    if(typeof mod == 'string') mod = getModFromKey(mod) || mod
    if(mod) {
      const finished = []
      finished.push(new Promise(resolve => dispatch(addModToList(mod, 'Installed', () => resolve()))))
      finished.push(doModInstall(mod, showConfirmation, globalOnly))
      Promise.all(finished).then(() => dispatch(nextAction))
    }
    else if(typeof nextAction == 'function') {
      console.warn('Couldn\'t install mod', mod)
      dispatch(nextAction)
    }
    
  }

  const getInstalledClients = () =>
  store.getState().get('data').get('installedClients').toJS()

const positions = ['home', 'talk', 'ally', 'enemy', 'talk_zoom', 'drive']

const getInstallPath = client => store.getState().get('data').get('installPaths').get(client)

async function doModInstall(mod, showConfirmation, globalOnly) {
  return new Promise(async function(resolve) {    
    const modData = await getModData(mod),
          {pckName, changedModelInfo, modelDiff} = modData,
          installedClients = globalOnly ? ['Global'] : getInstalledClients()
    fetchApk(modData).then(res => {
      if(!res) {
        Alert.alert('Error downloading mod', 'There was an error downloading ' + modData.id, [
          {text: 'Ok', onPress: resolve}
        ])
        return
      }
      const installs = [],
            modelInfoMessages = []
      installedClients.forEach(client => {
        installs.push(RNFS.copyFile(res.path(), getInstallPath(client) + `files/asset/character/${pckName}.pck`))
        if(modelDiff[client]) {
          modelInfoMessages.push(client + ':\n' + (
            modelDiff[client].reduce((acc, d) => {
              if(d.kind == 'N') {
                acc.push(`Adding ${JSON.stringify(d.rhs, null, 2)}`)
              }
              else if(d.path[0] != 'selectRect' && d.kind == 'E') {
                acc.push(`${d.path.join('.')}:   ${d.lhs} ➜ ${d.rhs}`)
              }
              else if(d.path[0] != 'selectRect') JSON.stringify(d, null, 2)
              return acc
            }, []).sort().join('\n')
          ))
        }
      })
      if(installs.length == 0) {
        alert('No versions of the game are enabled for mod installation. Check the app settings.')
      }

      const applyPositionChanges = () => {
        Object.keys(modelDiff).forEach(client => {
          if(installedClients.indexOf(client) > -1 && modelDiff[client]) {
            const modelInfo = store.getState().get('data').get('modelInfo').get(client)
            modelInfo[pckName] = changedModelInfo[client]
            const modelInfoPath = getInstallPath(client) + 'files/asset/character/model_info.json'
            RNFS.unlink(modelInfoPath)
              .then(() => 
                RNFS.writeFile(modelInfoPath, JSON.stringify(modelInfo, null, 2), 'utf8')
                  .then(() => {
                    readModelInfo(client)
                    resolve()
                  })
                  .catch(m => Alert.alert(`Error writing ${client} model_info.json`, m + ''))
              )
              .catch(m => Alert.alert(`Error clearing ${client} model_info.json`, m + ''))
          }
          else resolve()
        })
      }
      Promise.all(installs).then(() => {
        RNFS.unlink(res.path()).then(() => {
          const positionChanged = modelInfoMessages.length > 0
          if(showConfirmation) {
            Alert.alert('Mod Successfully Installed', 
              `Don't forget to restart Destiny Child if it\'s running.\n\n` +
              (positionChanged
                ? `Do you want to write the following recommended positioning changes to your model_info.json:\n\n` +
                  modelInfoMessages.join('\n\n')
                : ''),
                positionChanged
                  ?  [
                    {text: 'Do Nothing', style: 'cancel', onPress: resolve},
                    {text: 'Apply Changes', onPress: applyPositionChanges}
                  ]
                  : null,
                {cancelable: false}
            )
          }
          else applyPositionChanges()
        })
      })
    }).catch(errorMessage => alert(errorMessage))
  })
}

async function getModData(mod) {
  const installedClients = getInstalledClients(),
        id = typeof mod == 'string' ? mod : stringifyMod(mod),
        matches = id.match(/([a-z]{1,2}\d{3})_\d{2}/),
        pckName = matches[0],
        data = store.getState().get('data'),
        swap = mod.get && mod.get('swap'),
        defaultModelInfo = {
          Global: data.get('model_info.global')[pckName],
          KR: data.get('model_info.kr')[pckName],
          JP: data.get('model_info.jp')[pckName]
        },
        localModelInfo = {
          Global: store.getState().get('data').get('modelInfo').get('Global')[pckName],
          KR: store.getState().get('data').get('modelInfo').get('KR')[pckName],
          JP: store.getState().get('data').get('modelInfo').get('JP')[pckName]
        },
        swapModelInfo = {
          Global: swap && data.get('model_info.global')[swap],
          KR: swap && data.get('model_info.kr')[swap],
          JP: swap && data.get('model_info.jp')[swap]
        },
        newModelInfo = {
          Global: Object.assign({}, localModelInfo.Global, (swapModelInfo.Global || swapModelInfo.KR || defaultModelInfo.KR)),
          KR: Object.assign({}, localModelInfo.KR, (swapModelInfo.KR || defaultModelInfo.KR)),
          JP: Object.assign({}, localModelInfo.JP, (swapModelInfo.JP || defaultModelInfo.JP))
        },
        modelDiff = {
          Global: deepDiff(localModelInfo.Global, newModelInfo.Global) || false,
          KR: deepDiff(localModelInfo.KR, newModelInfo.KR) || false,
          JP: deepDiff(localModelInfo.JP, newModelInfo.JP) || false
        },
        changedModelInfo = {
          Global: modelDiff.Global ? newModelInfo.Global : false,
          KR: modelDiff.KR ? newModelInfo.KR : false,
          JP: modelDiff.JP ? newModelInfo.JP : false
        }
  return new Promise(resolve => {
    resolve({id, pckName, swap, changedModelInfo, modelDiff})
  })
}

const fetchApk = ({id, pckName}) =>
  RNFetchBlob
    .config({fileCache : true})
    .fetch('GET', `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}/${pckName}.pck`)
    .then((res) => {
      if(res.info().status == 200) return res
      else alert('There may have been a problem downloading. Got status code ' + res.info().status)
      return false
    })
