import {fromJS} from 'immutable'
import {DATA_SET_CHILDS, DATA_SET_MODS} from '../actions/data.js'

const defaultState = fromJS({
  childs: {},
  mods: []
})

export default ((state = defaultState, action = {}) => {
  console.log(action.type)
  if(action.type == DATA_SET_CHILDS) {
    return state.set('childs', action.childs)
  }
  if(action.type == DATA_SET_MODS) {
    return state.set('mods', action.mods)
  }
  return state
})