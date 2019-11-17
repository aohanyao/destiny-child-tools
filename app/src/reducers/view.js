import {fromJS} from 'immutable'
import {VIEW_SET, VIEW_GO_BACK} from '../actions/view.js'

export const history = [fromJS({name: 'Search', index: 0})]

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
  if(action.type == VIEW_GO_BACK) {
    history.pop()
    return history[history.length -1]
  }
  return state
}
