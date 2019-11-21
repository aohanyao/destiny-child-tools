import {fromJS} from 'immutable'
import {VIEW_SET, VIEW_GO_BACK, VIEW_CHILDS_SET, VIEW_CHILD_SET} from '../actions/view.js'

export const history = [fromJS({
  name: 'Childs', 
  index: 0,
  childs: {
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
  if(action.type == VIEW_CHILDS_SET) {
    state = state.set('index', history.length)
    state = state.set('childs', state.get('childs').set(action.setting, action.value))
    history.push(state)
    return state
  }
  if(action.type == VIEW_GO_BACK) {
    history.pop()
    return history[history.length -1]
  }
  return state
}
