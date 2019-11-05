import {fromJS} from 'immutable'
import mods from '../../docs/data/mods.json'

export default function(state = fromJS(mods), action) {
  if(action.type == 'MODS_SET') {
    return fromJS(action.mods)
  }
  return state
}
