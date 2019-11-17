import {fromJS} from 'immutable'

const load = (name, dflt) => {
  const stored = typeof localStorage == 'undefined'
    ? null
    : localStorage.getItem('child-list-filter-' + name)
  return stored === null
    ? dflt
    : stored.match(/^true|false$/)
      ? stored === 'true'
      : stored
}

const defaultState = fromJS({
  ids: [],
  numToShow: 50,
  asc: true,
  sort: 'id',
  page: 0,
  element: false,
  stars: false,
  category: false,
  type: false,
  view: 'cards',
  numMods: false,
  filter: ''
})

export default function(state = defaultState, action) {
  if(action.type == 'SET_CHILDS') {
    state = state.set('ids',
      fromJS(Object.keys(action.childs))
        .take(state.get('numToShow'))
    )
  }
  if(action.type == 'CHILD_LIST_SET_NUM_TO_SHOW') {
    state = state.set('numToShow', action.numToShow)
  }
  if(action.type == 'CHILD_LIST_SET_PAGE') {
    state = state.set('page', action.page)
  }
  if(action.type == 'CHILD_LIST_SET_SORT') {
    state = state.merge({
      sort: action.sort,
      asc: action.asc
    })
  }
  if(action.type == 'CHILD_LIST_SET_FILTER') {
    state = state.set(action.filter, action.value)
  }
  if(action.type == 'CHILDS' && action.meta.query) {
    Object.keys(action.meta.query).forEach(key => {
      if(typeof state.get(key) != 'unefined') state = state.set(key, action.meta.query[key])
    })
  }
  return state
}
