import RNFS from 'react-native-fs'
import stringifyMod from '../lib/stringify-mod'
import {setData} from './data'

const listsFile = RNFS.DocumentDirectoryPath + 'mod-lists.json'

export const readModLists = () => 
  dispatch => {
    const load = () => RNFS.readFile(listsFile)
      .then(data => {
        try {
          data = JSON.parse(data)
          console.log('modLists', data)
          dispatch(setData('modLists', data, false))
        }
        catch(e) {
          alert(e + '\n\n Consider restoring your model_info.json file in the settings view.')
        }
      })
    RNFS.exists(listsFile).then(exists => {
      if(!exists) {
        RNFS.writeFile(listsFile, JSON.stringify({Installed: []}, null, 2))
            .then(load)
      }
      else load()
    })
  }

export const addModToList = (mod, list) =>
  (dispatch, getState) => {
    console.log('mod', mod)
    const lists = getState().get('data').get('modLists'),
          characterId = mod.get('child') + '_' + mod.get('variant')
    lists[list] = lists[list].reduce((acc, modKey) => {
      if(!modKey.match(new RegExp('^' + characterId))) acc.push(modKey)
      return acc
    }, [])
    lists[list].push(stringifyMod(mod))
    lists[list].sort()
    RNFS.unlink(listsFile)
      .then(() => {
        RNFS.writeFile(listsFile, JSON.stringify(lists, null, 2), 'utf8')
          .then(() => dispatch(readModLists()))
          .catch(alert)
      })
  }