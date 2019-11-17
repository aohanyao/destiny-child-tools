import {fromJS} from 'immutable'
import {SETTINGS_SET_SETTING} from '../actions/settings.js'

const defaultState = fromJS({
  globalInstalled: false,
  krInstalled: false
})

export default (state = defaultState, action = {}) => {
  if(action.type == SETTINGS_SET_SETTING) {
    return state.set(action.key, action.value)
  }
  return state
}

