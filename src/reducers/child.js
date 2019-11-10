import {Map} from 'immutable'

export default (state = Map({mode: 'view'}), action) => {
  if(action.type == 'CHILD_SET_MODE') {
    state = state.set('mode', action.mode)
  }
  if(action.type == 'CHILD_SET_MOD_DETAILS') {
    state = state.set('modDetails', action.mod)
  }
  return state
}
