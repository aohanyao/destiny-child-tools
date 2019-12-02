import installModLegacy from '../lib/install-mod'
import {addModToList} from './mod-lists'


export const installMod = mod =>
  dispatch => {
    installModLegacy(mod)
    dispatch(addModToList(mod, 'Installed'))
  }