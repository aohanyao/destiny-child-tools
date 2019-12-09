import {fromJS} from 'immutable'
import {VIEW_SET, VIEW_GO_BACK, VIEW_SET_VIEW_DATA, VIEW_SET_DRAWER_OPEN} from '../actions/view.js'

export const history = [fromJS({
  name: 'Mods', 
  index: 0,
  drawerOpen: false,
  childs: {
    page: 0,
    sort: 'lastModAdded',
    order: 'desc'
  },
  modsList: {
    page: 0
  }
})]

export default (state = history[0], action = {}) => {
  if(action.type == VIEW_SET) {
    state = state.merge({name: action.name,
      id: action.id,
      index: history.length
    })
    history.push(state)
    return state
  }
  if(action.type == VIEW_SET_DRAWER_OPEN) {
    return state.set('drawerOpen', action.drawerOpen)
  }
  if(action.type == VIEW_SET_VIEW_DATA) {
    state = state.set('index', history.length)
    state = state.set(action.view, state.get(action.view).set(action.setting, action.value))
    history.push(state)
    return state
  }
  if(action.type == VIEW_GO_BACK) {
    history.pop()
    return history[history.length -1]
  }
  return state
}
