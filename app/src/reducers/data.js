import {fromJS} from 'immutable'
import {DATA_SET, DATA_SET_CLIENT_DATA} from '../actions/data.js'

const defaultState = fromJS({
  childs: {},
  mods: [],
  'model_info.kr': {},
  'model_info.global': {},
  modelInfo: {
    Global: {},
    KR: {}
  },
  installPaths: {
    Global: false,
    KR: false,
  },
  installedClients: []
})

export default ((state = defaultState, action = {}) => {
  if(action.type == DATA_SET) {
    return state.set(action.key, action.data)
  }
  if(action.type == DATA_SET_CLIENT_DATA) {
    if(action.key == 'modelInfo') {
      console.log(action.type, action.key, action.client, action.data.c000_01)
    }
    if(action.key == 'installPaths') {
      state = state.set('installedClients', state.get('installedClients').push(action.client))
    }
    return state.setIn([action.key, action.client], action.data)
  }

  return state
})