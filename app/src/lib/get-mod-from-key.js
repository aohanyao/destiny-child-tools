import store from '../store'
import stringifyMod from './stringify-mod'

export default key => 
  store.getState().get('data').get('mods').find(mod => stringifyMod(mod) == key)