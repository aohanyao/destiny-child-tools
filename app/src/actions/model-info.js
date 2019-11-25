import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import store from '../store'
import {setClientData} from './data'

export const readModelInfo = client =>
  (dispatch, getState) =>
    RNFS.readFile(getState().get('data').get('installPaths').get(client) + 'files/asset/character/model_info.json')
      .then(data => {
        try {
          data = JSON.parse(data)
          dispatch(setClientData('modelInfo', client, data))
        }
        catch(e) {
          alert(e + '\n\n Consider restoring your model_info.json file in the settings view.')
        }
      })

export const restoreModelInfo = client => 
  (dispatch, getState) => 
    RNFetchBlob
      .config({path: getState().get('data').get('installPaths').get(client) + 'files/asset/character/model_info.json'})
      .fetch('GET', `https://lokicoder.github.io/destiny-child-tools/data/model_info.${client.toLowerCase()}.json`)
      .then(() => {
        alert('Successfully restored')
        dispatch(readModelInfo(client))
      })
      .catch(alert)