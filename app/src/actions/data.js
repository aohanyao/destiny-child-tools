import {fromJS} from "immutable"
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'
import {readModelInfo} from './model-info'
import {getStoragePermission} from '../lib/permissions.js'

export const DATA_SET = 'DATA_SET'
export const DATA_SET_CLIENT_DATA = 'DATA_SET_CLIENT_DATA'

const clientPaths = {
        Global: '/Android/data/com.linegames.dcglobal/',
        KR: '/Android/data/com.NextFloor.DestinyChild/',
        JP: '/Android/Data/com.stairs.destinychild/'
      }

const storagePaths = [
  '/sdcard',
  '/storage',
  RNFetchBlob.fs.dirs.SDCardDir,
  '/storage/emulated/0', 
  '/storage/emulated/1',
  '/storage/emulator/0/',
  '/storage/emulator/1/'
]

export const setData = (key, data) => ({
  type: DATA_SET,
  key,
  data
})

export const setClientData = (key, client, data) => ({
  type: DATA_SET_CLIENT_DATA,
  key,
  client,
  data
})

export const fetchData = (file, useImmutable = true) =>
  dispatch => {
    fetch(`https://lokicoder.github.io/destiny-child-tools/data/${file}.json`)
      .then(response => response.json())
      .then(data => dispatch(setData(file, useImmutable ? fromJS(data) : data)))
      .catch(alert)
  }

export const detectInstalledClients = () => 
  dispatch => {
    getStoragePermission().then(() => {
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
          console.log('CHECKING', pathToCheck)
          RNFS.readDir(pathToCheck) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
            .then(() => {
              dispatch(setClientData('installPaths', client, pathToCheck))
              dispatch(readModelInfo(client))
              found[client] = true
              next()
            })
            .catch(next)
        }
        else next()
      }
      checkNextClientPath()
    })
  }