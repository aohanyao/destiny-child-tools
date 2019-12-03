import RNFS from 'react-native-fs'
import stringifyMod from '../lib/stringify-mod'
import {setData} from './data'
import {installMod} from './mods'
import {Alert} from 'react-native'

const listsFile = RNFS.DocumentDirectoryPath + 'mod-lists.json'

export const readModLists = nextAction => 
  dispatch => {
    const load = () => RNFS.readFile(listsFile)
      .then(data => {
        try {
          data = JSON.parse(data)
          dispatch(setData('modLists', data, nextAction))
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

export const addModToList = (mod, list, nextAction) =>
  (dispatch, getState) => {
    const lists = getState().get('data').get('modLists'),
          characterId = typeof mod == 'string' ? mod : mod.get('child') + '_' + mod.get('variant')
    lists[list] = lists[list].reduce((acc, modKey) => {
      if(!modKey.match(new RegExp('^' + characterId))) acc.push(modKey)
      return acc
    }, [])
    if(typeof mod == 'object' || (typeof mod == 'string' && mod.match(/^\w{1,2}\d{3}_\d\d-/))) {
      lists[list].push(typeof mod == 'string' ? mod : stringifyMod(mod))
      lists[list].sort()
    }
    RNFS.unlink(listsFile)
      .then(() => {
        RNFS.writeFile(listsFile, JSON.stringify(lists, null, 2), 'utf8')
          .then(() => dispatch(readModLists(nextAction)))
          .catch(m => Alert.alert(`Error writing lists file`, m + ''))
      })
  }

export const installList = listName => 
  (dispatch, getState) => {
    const list = getState().get('data').get('modLists')[listName]
    let i = 0
    const installNext = () => {
      dispatch(setData('loading', [i, list.length, `${listName == 'Installed' ? 'Re-' : ''}Installing "${listName}"`, list[i]]))
      i++
      dispatch(installMod(list[i], false, () => {
        if(i < list.length - 1) installNext()
        else {
          dispatch(setData('loading', false))
          Alert.alert('Mods successfully installed', `"${listName}" was ${listName == 'Installed' ? 're-' : ''}installed.`)
        }
      }))
    }
    installNext()
  }
