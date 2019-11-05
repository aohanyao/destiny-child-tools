import {fromJS} from 'immutable'
import childs from '../../docs/data/childs.json'

export default function(state = fromJS(childs), action) {
  if(action.type == 'MODS_SET') {
    return fromJS(action.mods)
  }
  return state
}
