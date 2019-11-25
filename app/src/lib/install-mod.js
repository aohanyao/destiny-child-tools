import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import {Alert} from 'react-native'
import stringifyMod from './stringify-mod.js'
import store from '../store.js'
import deepDiff from 'deep-diff'
import {readModelInfo} from '../actions/model-info'

const getInstalledClients = () =>
  store.getState().get('data').get('installedClients').toJS()

const positions = ['home', 'talk', 'ally', 'enemy', 'talk_zoom', 'drive']

const getInstallPath = client => store.getState().get('data').get('installPaths').get(client)

async function installMod(mod) {
  const modData = await getModData(mod),
        {pckName, changedModelInfo, modelDiff} = modData,
        installedClients = getInstalledClients()
  fetchApk(modData).then(res => {
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
    Promise.all(installs).then(() => {
      RNFS.unlink(res.path()).then(() => {
        const positionChanged = modelInfoMessages.length > 0
        Alert.alert('Mod Successfully Installed', 
          `Don't forget to restart Destiny Child if it\'s running.\n\n` +
          (positionChanged
            ? `Do you want to write the following recommended positioning changes to your model_info.json:\n\n` +
              modelInfoMessages.join('\n\n')
            : ''),
            positionChanged
              ?  [
                {text: 'Do Nothing', style: 'cancel'},
                {text: 'Apply Changes', onPress: () => {
                  Object.keys(modelDiff).forEach(client => {
                    if(modelDiff[client]) {
                      const modelInfo = store.getState().get('data').get('modelInfo').get(client)
                      modelInfo[pckName] = changedModelInfo[client]
                      const modelInfoPath = getInstallPath(client) + 'files/asset/character/model_info.json'
                      RNFS.unlink(modelInfoPath)
                        .then(() => 
                          RNFS.writeFile(modelInfoPath, JSON.stringify(modelInfo, null, 2), 'utf8')
                            .then(() => readModelInfo(client))
                            .catch(alert)
                        )
                        .catch(alert)
                    }
                  })
                }},
              ]
              : null,
            {cancelable: false}
        )
      })
    })
  }).catch(errorMessage => alert(errorMessage))
}
export default installMod

const getPaths = () => 
  clients.reduce((acc, client) => {
    const path = store.getState().get('settings').get(client + 'Path')
    if(path) acc[client] = path
    return acc
  }, {})



async function getModData(mod) {
  const installedClients = getInstalledClients(),
        id = typeof mod == 'string' ? mod : stringifyMod(mod),
        matches = id.match(/([a-z]{1,2}\d{3})_\d{2}/),
        pckName = matches[0],
        data = store.getState().get('data'),
        swap = mod.get && mod.get('swap'),
        defaultModelInfo = {
          Global: data.get('model_info.global')[pckName],
          KR: data.get('model_info.kr')[pckName]
        },
        localModelInfo = {
          Global: store.getState().get('data').get('modelInfo').get('Global')[pckName],
          KR: store.getState().get('data').get('modelInfo').get('KR')[pckName]
        },
        swapModelInfo = {
          Global: swap && data.get('model_info.global')[swap],
          KR: swap && data.get('model_info.kr')[swap]
        },
        newModelInfo = {
          Global: Object.assign({}, localModelInfo.KR, (swapModelInfo.KR || defaultModelInfo.KR)),
          KR: Object.assign({}, localModelInfo.KR, (swapModelInfo.KR || defaultModelInfo.KR))
        },
        modelDiff = {
          Global: deepDiff(localModelInfo.Global, newModelInfo.Global) || false,
          KR: deepDiff(localModelInfo.KR, newModelInfo.KR) || false
        },
        changedModelInfo = {
          Global: modelDiff.Global ? newModelInfo.Global : false,
          KR: modelDiff.KR ? newModelInfo.KR : false
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
      else alert('There may have been a problem downloading. Got status code ' + status)
    })
