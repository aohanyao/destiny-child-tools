import {fromJS} from 'immutable'
import {VIEW_SET, VIEW_GO_BACK, VIEW_CHILDS_SET_PAGE} from '../actions/view.js'

export const history = [fromJS({
  name: 'Childs', 
  index: 0,
  childs: {
    page: 0
  }
})]

export default (state = history[0], action = {}) => {
  if(action.type == VIEW_SET) {
    const view = fromJS({
      name: action.name,
      id: action.id,
      index: history.length
    })
    history.push(view)
    return view
  }
  if(action.type == VIEW_CHILDS_SET_PAGE) {
    state = state.set('index', history.length)
    state = state.set('childs', state.get('childs').set('page', action.page))
    history.push(state)
    return state
  }
  if(action.type == VIEW_GO_BACK) {
    history.pop()
    return history[history.length -1]
  }
  return state
}
