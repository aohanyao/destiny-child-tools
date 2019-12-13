import {fromJS} from 'immutable'
import modders from '../../docs/data/modders.json'
import {MODDERS_SET_SORT} from '../actions/modders'

export default function(state = fromJS({data: modders, sort: 'name', asc: true}), action) {
  if(action.type == MODDERS_SET_SORT) {
    state = state.merge({
      sort: action.sort,
      asc: action.asc
    })
  }
  return state
}
