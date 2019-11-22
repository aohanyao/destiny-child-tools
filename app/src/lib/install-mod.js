import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'
import deepmerge from 'deepmerge'
import {clientPaths} from './paths.js'
import stringifyMod from './stringify-mod.js'
import store from '../store.js'

console.log(deepmerge)

export default mod => {
  const id = typeof mod == 'string' ? mod : stringifyMod(mod),
        matches = id.match(/([a-z]{1,2}\d{3})_\d{2}/),
        pckName = matches[0],
        paths = Object.keys(clientPaths).reduce((acc, client) => {
          const path = store.getState().get('settings').get(client + 'Path')
          if(path) acc[client] = path
          return acc
        }, {}),
        data = store.getState().get('data'),
        origInfo = {
          Global: data.get('model_info.global')[pckName],
          KR: data.get('model_info.kr')[pckName]
        },
        swap = mod.get && mod.get('swap'),
        swapInfo ={
          Global: swap && data.get('model_info.global')[swap],
          KR: swap && data.get('model_info.kr')[swap]
        }
  RNFetchBlob
    .config({fileCache : true})
    .fetch('GET', `https://lokicoder.github.io/destiny-child-tools/live2d/assets/${id}/${pckName}.pck`)
    .then((res) => {
      if(res.info().status == 200) {
        const installs = [],
              installedClients = []
        Object.keys(paths).forEach(client => {
          if(paths[client]) {
            installs.push(RNFS.copyFile(res.path(), paths[client] + `files/asset/character/${pckName}.pck`))
            const modelInfo = swapInfo[client] || swapInfo.KR || origInfo[client] || origInfo.KR
            // alert(client + ' ' + JSON.stringify(swapInfo[client]))
            installedClients.push(client + ' ' + (
              swapInfo[client] 
                ? 'postion swap from ' + client + ' ' + swap
                : swapInfo.KR
                  ? 'postion swap from KR ' + swap
                  : origInfo[client]
                    ? 'position from ' + client + ' ' + pckName
                    : origInfo.KR
                      ? 'position from KR ' + pckName
                      : 'no position update'
            ))
            if(modelInfo) {
              installs.push(
                RNFS.readFile(paths[client] + 'files/asset/character/model_info.json').then(data => {
                  try {
                    data = JSON.parse(data)
                  }
                  catch(e) {
                    alert(e + '\n\n Consider restoring your model_info.json file in the settings view.')
                  }
                  data[pckName] = deepmerge(data[pckName], modelInfo)
                  RNFS.writeFile(paths[client] + 'files/asset/character/model_info.json', data)
                    .catch(alert)
                })
              )
            }
          }
        })
        if(installs.length == 0) {
          alert('No versions of the game are enabled for mod installation. Check the app settings.')
        }
        Promise.all(installs).then(() => {
          RNFS.unlink(res.path()).then(() => {
            alert(
              `Mod installed to ${pckName} for:\n\n` +
              installedClients.join('\n') +
              `\n\nRestart Destiny Child if it\'s running.`
            )
          })
        })
      }
      
      else {
        alert('There may have been a problem downloading. Got status code ' + status)
      }
      }).catch(errorMessage => alert(errorMessage))
}
