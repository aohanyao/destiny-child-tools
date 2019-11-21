import {fromJS} from 'immutable'
import {CHILD_VIEW_SET} from '../actions/child-view.js'

const defaultState = fromJS({
  original: false,
  nsfw: true,
  sfw: true,
  type: 'any',
  sort: 'added',
  order: 'desc',
  variant: false,
})

export default (state = defaultState, action = {}) => {
  if(action.type == CHILD_VIEW_SET) {
    return state.set(action.key, action.value)
  }
  return state
}

