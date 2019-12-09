import RNFS from 'react-native-fs'
import stringifyMod from '../lib/stringify-mod'
import {setData} from './data'
import {installMod} from './mods'
import {Alert} from 'react-native'
import {setView} from './view'

const listsFile = RNFS.DocumentDirectoryPath + 'mod-lists.json',
      defaultLists = {Installed: [], Favorites: []}

export const saveList = listName => 
  (dispatch, getState) => {
    const lists = getState().get('data').get('modLists'),
          filePath = RNFS.ExternalStorageDirectoryPath + '/Download/dc-mods-list-' + listName.toLowerCase().replace(/\s/g, '-') + '.json'
    RNFS.writeFile(filePath, JSON.stringify(lists[listName], null, 2))
      .then(() => {
        Alert.alert(
          'Mod list saved',
          'The mod lsit "' + listName + '" was saved to ' + filePath
        )
      })
      .catch(() => Alert.alert('Error', 'There was an error attempting to write the mod list to ' + filePath))
  }

export const importList = data =>
  (dispatch, getState) => {
    let i = 1
    const lists = getState().get('data').get('modLists'),
          name = data.name.replace(/dc-mods-list-/, '').replace(/\.\w+$/, ''),
          getListName = () => name + (i > 1 ? ' ' + i : '')
    while(lists[getListName()]) { i++ }
    RNFS.readFile(data.uri).then(content => {
      try {
        const list = JSON.parse(content)
        lists[getListName()] = list
        if(lists.length == 0 || !list.forEach) {
          throw new Error('List appears to be empty or is not an array')
        }
        list.forEach(mod => {
          if(typeof mod != 'string') {
            throw new Error('All items in the list must be strings')
          }
        })
        _writeLists(lists).then(() => dispatch(readModLists(setView('ModList', getListName()))))
        Alert.alert('Mod List Imported', 'The mod list "' + getListName() + '" has been successfully imported.')
      }
      catch(e) {
        Alert.alert('Error importing list', 'The file ' + data.name + ' does not appear to be a valid list. It should be a JSON formatted array of mod names.\n\n' + e.message)
      }
    }) 
  }

export const setActiveModList = modListName => 
  setData('activeModList', modListName)

export const createModList = () => 
  (dispatch, getState) => {
    const lists = getState().get('data').get('modLists')
    let i = 1,
        getListName = () => 'New List' + (i > 1 ? ' ' + i : '')

    while(lists[getListName()]) { i++}
    lists[getListName()] = []
    _writeLists(lists).then(() => dispatch(readModLists(
      dispatch => {
        dispatch(setView('ModList', getListName()))
        dispatch(setActiveModList(getListName()))
      }
    )))
  }

export const renameModList = (id, newName) => 
  (dispatch, getState) => {
    const lists = getState().get('data').get('modLists')
    dispatch(setActiveModList())
    lists[newName] = lists[id]
    delete lists[id]
    _writeLists(lists).then(() => dispatch(readModLists(setView('ModList', newName))))
  }

export const deleteModList = id => 
  (dispatch, getState) => {
    dispatch(setActiveModList())
    const lists = getState().get('data').get('modLists')
    delete lists[id]
    _writeLists(lists).then(() => dispatch(readModLists(setView('ModLists'))))
  }

export const readModLists = nextAction => 
  dispatch => {
    const load = () => RNFS.readFile(listsFile)
      .then(data => {
        try {
          data = JSON.parse(data)
          dispatch(setData('modLists', data, nextAction))
        }
        catch(e) {
          console.log(data)
          RNFS.unlink(listsFile)
              .then(() => {
                RNFS.writeFile(listsFile, JSON.stringify(defaultLists, null, 2))
                  .then(() => dispatch(readModLists(nextAction)))
              })
          alert(e + '\n\n Error importing mod list data.')
        }
      })
    RNFS.exists(listsFile).then(exists => {
      if(!exists) {
        RNFS.writeFile(listsFile, JSON.stringify(defaultLists, null, 2))
            .then(load)
      }
      else load()
    })
  }

export const removeModFromList = (mod, list, nextAction) => 
  (dispatch, getState) => {
    const lists = _removeModFromList(mod, list, getState)
    _writeLists(lists).then(() => dispatch(readModLists(nextAction)))
  }

const _removeModFromList = (mod, list, getState) => {
  const lists = getState().get('data').get('modLists'),
        characterId = typeof mod == 'string' ? mod : mod.get('child') + '_' + mod.get('variant')
  lists[list] = lists[list] || []
  lists[list] = lists[list].reduce((acc, modKey) => {
    if(!modKey.match(new RegExp('^' + characterId))) acc.push(modKey)
    return acc
  }, [])
  return lists
}

const _writeLists = lists => new Promise(resolve => {
  RNFS.unlink(listsFile)
    .then(() => {
      RNFS.writeFile(listsFile, JSON.stringify(lists, null, 2), 'utf8')
        .then(() => resolve())
        .catch(m => Alert.alert(`Error writing lists file`, m + ''))
    })
})

export const addModToList = (mod, list, nextAction) =>
  (dispatch, getState) => {
    console.log('adding to', list, mod)
    const lists = _removeModFromList(mod, list, getState)
    if(typeof mod == 'object' || (typeof mod == 'string' && mod.match(/^\w{1,2}\d{3}_\d\d-/))) {
      lists[list].push(typeof mod == 'string' ? mod : stringifyMod(mod))
      lists[list].sort()
    }
    _writeLists(lists).then(() => dispatch(readModLists(nextAction)))
  }

export const installList = (listName, nameOverride, globalOnly) => 
  (dispatch, getState) => {
    const list = typeof listName == 'string' 
            ? getState().get('data').get('modLists')[listName]
            : listName,
          name = nameOverride || listName    
    console.log('installing', listName, list)
    let i = 0
    const installNext = () => {
      dispatch(setData('loading', [i, list.length, `${name == 'Installed' ? 'Re-' : ''}Installing "${name}"`, list[i]]))
      dispatch(installMod(list[i], false, () => {
        if(i < list.length - 1) installNext()
        else {
          dispatch(setData('loading', false))
          Alert.alert('Mods successfully installed', `"${name}" was ${name == 'Installed' ? 're-' : ''}installed.`)
        }
      }, globalOnly))
      i++
    }
    installNext()
  }

