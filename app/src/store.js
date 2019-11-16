import {fromJS} from 'immutable'
import {combineReducers} from 'redux-immutable'
import {createStore} from 'redux'
import view from './reducers/view.js'
import data from './reducers/data.js'
import {setChilds, setMods} from './actions/data.js'

const store = createStore(combineReducers({
  data,
  view
}))

fetch('https://lokicoder.github.io/destiny-child-tools/data/childs.json')
  .then((response) => response.json())
  .then((childs) => {
    store.dispatch(setChilds(fromJS(childs)))
  })
  .catch((error) => {
    alert(error)
  })

fetch('https://lokicoder.github.io/destiny-child-tools/data/mods.json')
  .then((response) => response.json())
  .then((mods) => {
    store.dispatch(setMods(fromJS(mods)))
  })
  .catch((error) => {
    alert(error)
  })


export default store