import {fromJS} from 'immutable'
import {DATA_SET} from '../actions/data.js'

const defaultState = fromJS({
  childs: {},
  mods: [],
  'model_info.kr': {},
  'model_info.global': {}
})

export default ((state = defaultState, action = {}) => {
  if(action.type == DATA_SET) {
    return state.set(action.key, action.data)
  }

  return state
})