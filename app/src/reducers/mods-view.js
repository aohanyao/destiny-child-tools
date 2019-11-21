import {fromJS} from 'immutable'
import {MODS_VIEW_SET} from '../actions/mods-view.js'

const defaultState = fromJS({
  filter: '',
  page: 0
})

export default (state = defaultState, action = {}) => {
  if(action.type == MODS_VIEW_SET) {
    return state.set(action.key, action.value)
  }
  return state
}

